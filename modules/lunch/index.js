const { join } = require('path')
const service = require('./service')

module.exports = app => {
  app.get('/lunches', async (req, res) => {
    return res.sendFile(join(__dirname + '/page.html'))
  })

  global.io.on('connection', async socket => {
    socket.emit('MENU', await service.index())
    socket.emit('ORDER', await service.getOrder())

    socket.on('ORDER', async data => {
      await service.order(data, socket)
      socket.emit('ORDER', await service.getOrder())
    })
  })
}
