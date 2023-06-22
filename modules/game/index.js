const Room = require('../../models/room')
const User = require('../../models/user')

module.exports = app => {
  app.get('/game', async (req, res) => {
    return res.send(await require('./service').index(req))
  })

  global.io.on('connection', async socket => {
    socket.join('CHANNEL')
    if (socket.auth.roomId) socket.join(socket.auth.roomId)

    socket.on('COMMAND', async data => {
      if (data.name === 'gameOver') {
        const room = await Room.findOne({ _id: socket.auth.roomId })
        if (!room) return false
        await Room.updateOne({ _id: socket.auth.roomId }, { $set: { status: 3 } })
        for (let i in room.players) {
          await User.updateMany(
            {
              _id: room.players[i].id
            },
            { roomId: null }
          )
        }
      }
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
