module.exports = (app) => {
  io.on('connection', async socket => {
    const auth = socket.handshake.auth;
  
    if (!auth || !auth.userId || !auth.userName) return false
  
    // Host of room join 
    if (auth.roomId) {
      if (auth.userId === auth.roomId) {
        socket.join(auth.roomId);
        socket.join('ROOM');
      } else {
        socket.leave(auth.roomId, function (e) {
          console.log('abc')
        });
      }
    }

    socket.join('CHANNEL');
    fetchUsers();
    fetchRooms();

    socket.on('CREATE_ROOM', () => {
      const roomId = auth.userId;
      socket.join(roomId);
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
  var rooms = [];
  const clients = await io.sockets.in('ROOM').fetchSockets();
  for (let client of clients) {
    const userRoomClients = await io.sockets.in(client.handshake.auth.userId).fetchSockets();
    if (!userRoomClients.length) continue;
    rooms.push({
      roomId: client.handshake.auth.userId,
      roomName: client.handshake.auth.userName,
      number: userRoomClients.length
    })
  }

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