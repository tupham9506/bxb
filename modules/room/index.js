const Room = require('./../../models/rooms')
const  { v4: uuidv4 } = require('uuid');

module.exports = async app => {
  io.on('connection', async socket => {
    const auth = socket.handshake.auth;
  
    if (!auth || !auth.userId || !auth.userName) return false

    if (auth.roomId) {
      const room = await Room.findOne({
        roomId: auth.roomId,
        status: 1
      });

      if (room) {
        socket.join(auth.roomId);
        socket.join('ROOM');
      }
    }

    socket.join('CHANNEL');
    fetchUsers();
    fetchRooms();

    socket.on('CREATE_ROOM', async () => {
      
      const room = await Room.create({
        keyUserId: auth.userId,
        roomName: auth.userName,
        players:[{
          userId: auth.userId
        }]
      })

      socket.join(room.id);
      socket.join('ROOM');
      socket.emit('CREATE_ROOM', { roomId });
      fetchRooms();
    })

    socket.on('JOIN_ROOM', async data => {
      let clients = await io.sockets.in(data.roomId).fetchSockets();
      if (clients.length === 1) {
        socket.join(data.roomId);
        io.sockets.in(data.roomId).emit('JOIN_ROOM', {
          roomId: data.roomId
        });
        fetchRooms();
      }
    });
  
    socket.on('disconnect', function () {
      fetchRooms();
      fetchUsers();
    });
  });
}

async function fetchRooms () {
  var rooms = await Room.find({
    status: 1
  });

  io.in('CHANNEL').emit('ROOM_LIST', rooms)
}

async function fetchUsers () {
  var users = [];
  const clients = await io.sockets.in('CHANNEL').fetchSockets();
  for (let client of clients) {
    users.push({
      userId: client.handshake.auth.userId,
      userName: client.handshake.auth.userName,
    })
  }
  io.in('CHANNEL').emit('USER_LIST', users)
}