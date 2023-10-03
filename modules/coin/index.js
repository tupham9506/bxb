var path = require('path')

module.exports = app => {
  app.get('/coin', function (_req, res) {
    res.sendFile(path.join(__dirname + '/page.html'))
  })

  global.io.on('connection', async socket => {
    socket.join('COIN_CHANNEL')
    socket.on('NEW_BLOCK', data => {
      global.io.in('COIN_CHANNEL').emit('NEW_BLOCK', data)
    })

    socket.on('MINT_BLOCK', data => {
      global.io.in('COIN_CHANNEL').emit('MINT_BLOCK', data)
    })
  })
}
