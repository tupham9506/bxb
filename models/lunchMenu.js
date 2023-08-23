const { defineSchema } = require('./baseSchema')

module.exports = global.database.model(
  'lunch_menus',
  defineSchema({
    id: String,
    name: String,
    price: Number,
    image: String
  })
)
