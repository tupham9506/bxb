const { join } = require('path')
module.exports = app => {
  app.get('/login', async (req, res) => {
    return res.sendFile(join(__dirname + '/page.html'))
  })

  app.post('/login', async (req, res) => {
    return res.send(await require('./service').login(req))
  })
}
