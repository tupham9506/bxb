const { defineSchema } = require("./baseSchema");

module.exports = global.database.model(
  "rooms",
  defineSchema({
    roomId: String,
    keyUserId: String,
    roomName: String,
    players: Array,
    status: {
      type: String,
      default: 1
    }
  })
)