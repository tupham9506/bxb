var path = require('path')

module.exports = app => {
  app.get('/version', function (_req, res) {
    res.sendFile(path.join(__dirname + '/page.html'))
  })
}
