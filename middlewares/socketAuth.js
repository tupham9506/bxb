const User = require('./../models/user')

module.exports = async (socket, next) => {
  const auth = socket.handshake.auth
  if (!auth || !auth.id) return next(new Error('Unauthorized!'))

  const user = await User.findOne({
    _id: auth.id
  })

  socket.auth = user
  if (!user) return next(new Error('Unauthorized!'))
  next()
}
