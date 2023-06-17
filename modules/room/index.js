var path = require('path')
const Room = require('./../../models/room')
const User = require('./../../models/user')

module.exports = async app => {
  app.get('/room', function (_req, res) {
    res.sendFile(path.join(__dirname + '/room.html'))
  })

  global.io.on('connection', async socket => {
    socket.join('CHANNEL')
    if (socket.auth.roomId) {
      socket.join(socket.auth.roomId)
      socket.join('ROOM')
    }

    fetchUsers()
    fetchRooms()

    socket.on('CREATE_ROOM', async () => {
      const players = {}

      players[socket.auth.id] = {
        id: socket.auth.id,
        userName: socket.auth.userName,
        isKey: 1
      }

      const room = await Room.create({
        id: socket.auth.id,
        roomName: socket.auth.userName,
        userId: socket.auth.id,
        players
      })

      room.id = room._id
      await room.save()

      await User.updateOne({ _id: socket.auth._id }, { roomId: room.id })
      socket.emit('CREATE_ROOM')
      fetchRooms()
    })

    socket.on('JOIN_ROOM', async data => {
      const room = await Room.findOne({ _id: data.id })
      if (!room || Object.keys(room.players).length >= 2) return false
      room.players[socket.auth.id] = {
        id: socket.auth.id,
        userName: socket.auth.userName
      }

      await Room.updateOne({ _id: data.id }, { players: room.players })

      await User.updateOne({ _id: socket.auth._id }, { roomId: room.id })
      socket.emit('JOIN_ROOM')
      fetchRooms()
    })

    socket.on('disconnect', function () {
      fetchRooms()
      fetchUsers()
    })
  })
}

async function fetchRooms() {
  const rooms = []
  var dbRooms = await Room.find({
    status: 1
  })

  for (let dbRoom of dbRooms) {
    let clients = await global.io.sockets.in(dbRoom.id).fetchSockets()

    if (clients.length) {
      rooms.push(dbRoom)
    }
  }

  global.io.in('CHANNEL').emit('ROOM_LIST', rooms)
}

async function fetchUsers() {
  const clients = await global.io.sockets.in('CHANNEL').fetchSockets()
  const users = await User.find({
    _id: {
      $in: clients.map(client => client.handshake.auth.id)
    }
  })

  global.io.in('CHANNEL').emit('USER_LIST', users)
}
