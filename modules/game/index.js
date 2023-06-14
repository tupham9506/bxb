module.exports = (app) => {
  app.get('/game', function (req, res) {
    return res.send(require('./service').index(req));
  });

  io.on('connection', async socket => {
    const auth = socket.handshake.auth;
  
    if (!auth || !auth.userId || !auth.roomId) return false

    socket.join(auth.roomId);
    socket.join('CHANNEL');

    socket.on('COMMAND', data => {
      io.sockets.in(auth.roomId).emit('COMMAND', data)
    });
  });
}