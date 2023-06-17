const services = require('./service')
const Room = require('./../../models/room')

module.exports = app => {
  app.get('/select', function (req, res) {
    return res.send(services.page())
  })

  global.io.on('connection', async socket => {
    socket.join('CHANNEL')

    if (socket.auth.roomId) socket.join(socket.auth.roomId)

    socket.on('SELECT_BALL', async data => {
      const room = await Room.findOne({ _id: socket.auth.roomId })
      room.players[socket.auth.id]['ballId'] = data.ballId
      await Room.updateOne({ _id: room._id }, { players: room.players })
      global.io.in(room.id).emit('ROOM_DETAIL', room)
    })

    socket.on('READY', async () => {
      
      const room = await Room.findOne({ _id: socket.auth.roomId })
      room.players[socket.auth.id][] = data.ballId
      await Room.updateOne({ _id: room._id }, { players: room.players })
      global.io.sockets.in(socket.auth.roomId).emit('READY')
    })

    socket.on('START_GAME', () => {
      global.io.sockets.in(socket.auth.roomId).emit('START_GAME')
    })

    fetchRoom(socket.auth.roomId)
  })
}

async function fetchRoom(roomId) {
  const room = await Room.findOne({
    _id: roomId,
    status: 1
  })

  global.io.in(roomId).emit('ROOM_DETAIL', room)
}
