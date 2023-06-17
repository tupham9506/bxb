const { defineSchema } = require('./baseSchema')

module.exports = global.database.model(
  'users',
  defineSchema({
    id: String,
    userName: String,
    roomId: String
  })
)
