const { defineSchema } = require('./baseSchema')
const { Schema } = require('mongoose')

module.exports = global.database.model(
  'lunch_order_items',
  defineSchema({
    id: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    lunch_menu: {
      type: Schema.Types.ObjectId,
      ref: 'lunch_menus'
    }
  })
)
