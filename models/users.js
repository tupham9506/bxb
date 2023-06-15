const { defineSchema } = require("./baseSchema");

module.exports = global.database.model(
  "users",
  defineSchema({
    userName: String
  })
)