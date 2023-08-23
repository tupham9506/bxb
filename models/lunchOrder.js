const { defineSchema } = require('./baseSchema')
const { Schema } = require('mongoose')

module.exports = global.database.model(
  'lunch_orders',
  defineSchema({
    id: String,
    date: String,
    lunch_order_items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'lunch_order_items'
      }
    ],
    amount: Number,
    discount: Number,
    total: Number,
    promos: Array
  })
)
