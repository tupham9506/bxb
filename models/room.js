const { defineSchema } = require('./baseSchema')

module.exports = global.database.model(
  'rooms',
  defineSchema({
    id: String,
    userId: String,
    roomName: String,
    players: Object,
    status: {
      type: Number,
      default: 1
    }
  })
)
