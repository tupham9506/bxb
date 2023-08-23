const { defineSchema } = require('./baseSchema')

module.exports = global.database.model(
  'lunches',
  defineSchema({
    id: String,
    date: String
  })
)
