var path = require('path')
const User = require('./../../models/user')

module.exports = app => {
  app.get('/', function (_req, res) {
    res.sendFile(path.join(__dirname + '/page.html'))
  })

  app.get('/api/user', async (req, res) => {
    return res.json({
      data: await User.findOne({
        _id: req.id
      })
    })
  })

  app.post('/api/start', async (req, res) => {
    if (!req.cookies.id) {
      const user = await User.create({
        userName: req.body.userName
      })
      user.id = user._id.valueOf()
      await user.save()

      res.cookie('id', user.id)
    }
    return res.json({})
  })
}
