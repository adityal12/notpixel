const axios = require('axios');
const fs = require('fs');

// Replace these values with the Pixel ID and newColor you want to use
const pixelId = 519485; // Example Pixel ID
const newColor = "#000000"; // Example color

// Get user info and energy status
async function getUserInfoAndEnergyStatus(token) {
  try {
    const userInfoResponse = await axios.get('https://notpx.app/api/v1/users/me', {
      headers: {
        'Authorization': `initData ${token}`
      }
    });
    const userInfo = userInfoResponse.data;

    const energyStatusResponse = await axios.get('https://notpx.app/api/v1/mining/status', {
      headers: {
        'Authorization': `initData ${token}`
      }
    });
    const energyStatus = energyStatusResponse.data;

    return {
      firstName: userInfo.firstName,
      balance: userInfo.balance,
      charges: energyStatus.charges,
      maxCharges: energyStatus.maxCharges,
      userBalance: energyStatus.userBalance
    };
  } catch (error) {
    console.error('Error getting user info and energy status:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Start the repaint process
async function startRepaint(token, pixelId, newColor) {
  try {
    const repaintResponse = await axios.post('https://notpx.app/api/v1/repaint/start', {
      pixelId,
      newColor
    }, {
      headers: {
        'Authorization': `initData ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return repaintResponse.data.balance;
  } catch (error) {
    console.error('Error starting repaint:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Logging user info
function logUserInfo(userInfo) {
  console.log("👤  User: " + userInfo.firstName);
  console.log("💰  Initial Balance: " + userInfo.balance);
  console.log("⚡  Charges: " + userInfo.charges + '/' + userInfo.maxCharges);
  console.log("=======================\n");
}

// Logging repaint result
function logRepaintResult(userInfo, newBalance) {
  console.log("🎨  Repaint done for " + userInfo.firstName + ".");
  console.log("💸  New Balance: " + newBalance);
  console.log("⚡  Remaining Charges: " + userInfo.charges + '/' + userInfo.maxCharges);
  console.log("=======================\n");
}

// Main function to handle the auto-repaint process
async function autoRepaintUntilOutOfEnergy() {
  const tokens = fs.readFileSync('hash.txt', 'utf8').split("\n");
  for (const token of tokens) {
    const trimmedToken = token.trim();
    if (trimmedToken.length === 0) continue;

    const userInfo = await getUserInfoAndEnergyStatus(trimmedToken);
    if (!userInfo) {
      console.error("❌  Failed to retrieve user info or status.");
      continue;
    }

    logUserInfo(userInfo);

    while (userInfo.charges > 0) {
      const newBalance = await startRepaint(trimmedToken, pixelId, newColor);
      if (newBalance === null) break;  // Stop if repaint fails

      logRepaintResult(userInfo, newBalance);
      const updatedInfo = await getUserInfoAndEnergyStatus(trimmedToken);
      userInfo.charges = updatedInfo.charges;  // Update charges correctly
      userInfo.maxCharges = updatedInfo.maxCharges;
    }

    if (userInfo.charges === 0) {
      console.log("❌  No more charges available for " + userInfo.firstName + ". Stopping repaint for this user.");
    }
  }
  console.log("✅  All users processed. Waiting 10 minutes before next run...\n");
  setTimeout(autoRepaintUntilOutOfEnergy, 600000);  // 10-minute wait before restarting
}

// Start the repaint process
autoRepaintUntilOutOfEnergy();
