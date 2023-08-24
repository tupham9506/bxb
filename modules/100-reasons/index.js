const { join } = require('path')
const { reasons } = require('./constants')

module.exports = app => {
  app.get('/100-reasons', async (req, res) => {
    return res.sendFile(join(__dirname + '/page.html'))
  })

  app.get('/api/100-reasons', async (req, res) => {
    return res.send(reasons)
  })
}
