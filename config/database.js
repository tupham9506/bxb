const mongoose = require('mongoose')
global.database = mongoose

module.exports = () => {
  const host = process.env.DB_HOST || '127.0.0.1'
  const port = process.env.DB_PORT || '27017'
  let option = {
    dbName: process.env.DB_NAME
  }

  return global.database
    .connect(`mongodb://${host}:${port}`, option)
    .then(() => console.log('Database is connected!'))
    .catch(err => global.logger.error(err))
}
