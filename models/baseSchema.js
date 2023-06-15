const { Schema } = require('mongoose');

const defineSchema = (definition) => {
  return new Schema(definition, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
}
module.exports = {
  defineSchema
}

