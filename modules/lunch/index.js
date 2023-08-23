const { join } = require('path')
module.exports = app => {
  app.get('/lunches', async (req, res) => {
    return res.sendFile(join(__dirname + '/page.html'))
  })

  app.get('/lunches/menu', async (req, res) => {
    return res.send(await require('./service').index(req))
  })
}
