const axios = require('axios'),
  fs = require('fs'),
  readline = require('readline'),
  readFile = (_0xaf0470) => {
    return new Promise((_0xd53994, _0x29b923) => {
      const _0x1777eb = [],
        _0x40a604 = readline.createInterface({
          input: fs.createReadStream(_0xaf0470),
          output: process.stdout,
          terminal: false,
        })
      _0x40a604.on('line', (_0x59b261) => {
        _0x1777eb.push(_0x59b261.trim())
      })
      _0x40a604.on('close', () => _0xd53994(_0x1777eb))
      _0x40a604.on('error', (_0x1cd7e1) => _0x29b923(_0x1cd7e1))
    })
  },
  askQuestion = (_0x11cbfa) => {
    const _0x4a9274 = {
      input: process.stdin,
      output: process.stdout,
    }
    const _0x4c1307 = readline.createInterface(_0x4a9274)
    return new Promise((_0x5b19f5) =>
      _0x4c1307.question(_0x11cbfa, (_0x385424) => {
        _0x4c1307.close()
        _0x5b19f5(_0x385424)
      })
    )
  },
  getStatusMining = async (_0x48114e) => {
    try {
      const _0x423156 = await axios.get(
        'https://notpx.app/api/v1/mining/status',
        {
          headers: {
            Authorization: 'initData ' + _0x48114e,
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
          },
        }
      )
      return _0x423156.data.userBalance
    } catch (_0x25846f) {
      return (
        console.error('Error getting mining status:', _0x25846f.message), null
      )
    }
  },
  clearTask = async (_0x4e514c, _0x31fbff) => {
    let _0x19b19b = 0
    const _0x289f25 = { length: 500 }
    const _0x3da70e = { Authorization: 'initData ' + _0x4e514c }
    _0x3da70e['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0'
    const _0x2f6ef9 = { headers: _0x3da70e }
    const _0x26fde4 = Array.from(_0x289f25, () =>
      axios.get(_0x31fbff, _0x2f6ef9)
    )
    try {
      const _0x42baa1 = await Promise.all(_0x26fde4)
      _0x42baa1.forEach((_0x37669a) => {
        _0x37669a.data[Object.keys(_0x37669a.data)[0]] === true &&
          (_0x19b19b += 1)
      })
    } catch (_0x1bc648) {}
    return _0x19b19b
  },
  runMiningTasks = async () => {
    const _0x2f891a = await readFile('./hash.txt')
    console.log('\nVIP ADFMIDN - Not Pixel Kehokian\n')

    for (const [_0x1a038e, _0x2153e1] of _0x2f891a.entries()) {
      console.log(
        '[\x1B[34m!\x1B[0m] \x1B[34mLogin Akun ke-' +
          (_0x1a038e + 1) +
          '\x1B[0m'
      )
      let _0x1f31fa = await getStatusMining(_0x2153e1)
      if (_0x1f31fa !== null) {
        console.log(
          '    [\x1B[32m+\x1B[0m] Balance : \x1B[33m' + _0x1f31fa + '\x1B[0m'
        )
        const _0x3fb434 = [
          'https://notpx.app/api/v1/mining/task/check/x?name=notpixel',
          'https://notpx.app/api/v1/mining/task/check/x?name=notcoin',
          'https://notpx.app/api/v1/mining/task/check/channel?name=notcoin',
          'https://notpx.app/api/v1/mining/task/check/channel?name=notpixel_channel',
          'https://notpx.app/api/v1/mining/task/check/joinSquad',
          'https://notpx.app/api/v1/mining/task/check/premium',
          'https://notpx.app/api/v1/mining/task/check/leagueBonusGold',
          'https://notpx.app/api/v1/mining/task/check/leagueBonusSilver',
        ]
        for (const _0x4b3a37 of _0x3fb434) {
          const _0x52b65f = _0x4b3a37.split('/'),
            _0x18ecf4 = _0x52b65f[_0x52b65f.length - 1],
            _0x5ad2bf = _0x4b3a37.split('?')[1] || ''
          let _0x575d96 = _0x18ecf4
          _0x5ad2bf && (_0x575d96 += '?' + _0x5ad2bf)
          const _0x33e98b = await clearTask(_0x2153e1, _0x4b3a37)
          if (_0x33e98b > 0) {
            console.log(
              '   [\x1B[32m+\x1B[0m] \x1B[32mTask ' +
                _0x575d96 +
                ' berhasil sebanyak ' +
                _0x33e98b +
                '\x1B[0m'
            )
          } else {
            console.log(
              '   [\x1B[31m-\x1B[0m] \x1B[31mTask ' +
                _0x575d96 +
                ' Gagal\x1B[0m'
            )
          }
        }
        let _0x395faf = await getStatusMining(_0x2153e1)
        _0x395faf !== null &&
          console.log(
            '   [\x1B[32m+\x1B[0m] Now Balance : \x1B[33m' +
              _0x395faf +
              '\x1B[0m'
          )
      }
    }
  }
runMiningTasks()
