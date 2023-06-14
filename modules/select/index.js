const services = require('./service');

module.exports = (app) => {
  app.get('/select', function (req, res) {
    return res.send(services.page());
  });

  io.on('connection', async socket => {
    const auth = socket.handshake.auth;
  
    if (!auth || !auth.userId || !auth.userName || !auth.roomId) return false
  
    socket.join('CHANNEL');
    socket.join(auth.roomId);

    socket.on('SELECT_BALL', async data => {
      io.sockets.in(data.roomId).emit('SELECT_BALL', data);
    });

    socket.on('READY', () => {
      io.sockets.in(auth.roomId).emit('READY');
    });

    socket.on('START_GAME', () => {
      io.sockets.in(auth.roomId).emit('START_GAME');
    });
  
    io.on('disconnected', () => fetchRoom());

    fetchRoom(auth.roomId)
  });
}

async function fetchRoom (roomId) {
  const rooms = [];
  const clients = await io.sockets.in(roomId).fetchSockets();
  for (let client of clients) {
    rooms.push({
      userId: client.handshake.auth.userId,
      userName: client.handshake.auth.userName,
    })
  }
  io.in(roomId).emit('ROOM_DETAIL', rooms)
}