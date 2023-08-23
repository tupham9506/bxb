const User = require('./../models/user')
const jwt = require('jsonwebtoken')

module.exports = async (socket, next) => {
  const token = socket.handshake.auth.token

  try {
    var auth = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return next(new Error('Unauthorized!'))
  }

  const user = await User.findOne({
    _id: auth.id
  })

  if (!user) return next(new Error('Unauthorized!'))

  socket.auth = user

  next()
}
