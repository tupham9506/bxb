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

    socket.on('START_GAME', async () => {
      const room = await Room.findOne({ _id: socket.auth.roomId })
      if (!room.players[socket.auth.id].ballId) return false
      room.players[socket.auth.id].status = 1 // Ready
      let isAllReady = true
      for (let i in room.players) {
        if (room.players[i].status !== 1) {
          isAllReady = false
          break
        }
      }
      if (Object.keys(room.players).length && isAllReady) {
        room.status = 2 // Start game
      }
      await Room.updateOne({ _id: room._id }, { status: room.status, players: room.players })
      await fetchRoom(socket.auth.roomId)
    })

    await fetchRoom(socket.auth.roomId)
  })
}

async function fetchRoom(roomId) {
  const room = await Room.findOne({
    _id: roomId,
    status: {
      $in: [1, 2]
    }
  })

  global.io.in(roomId).emit('ROOM_DETAIL', room)
}
