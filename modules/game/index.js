const Room = require('../../models/room')
module.exports = app => {
  app.get('/game', async (req, res) => {
    return res.send(await require('./service').index(req))
  })

  global.io.on('connection', async socket => {
    socket.join('CHANNEL')
    if (socket.auth.roomId) socket.join(socket.auth.roomId)

    socket.on('COMMAND', data => {
      global.io.sockets.in(socket.auth.roomId).emit('COMMAND', data)
    })

    await fetchRoom(socket.auth.roomId)
  })
}

async function fetchRoom(roomId) {
  const room = await Room.findOne({
    _id: roomId,
    status: 2
  })

  global.io.in(roomId).emit('ROOM_DETAIL', room)
}
