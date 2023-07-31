var path = require('path')
const User = require('./../../models/user')
const mongoose = require('mongoose')
const app = require('./app')

module.exports = app => {
  app.get('/', function (_req, res) {
    return res.send(app())
    // res.sendFile(path.join(__dirname + '/page.html'))
  })

  app.get('/api/user', async (req, res) => {
    return res.json({
      data: await User.findOne({
        _id: req.cookies.id
      })
    })
  })

  app.post('/api/start', async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.cookies.id || new mongoose.mongo.ObjectId(),
      {
        $set: { userName: req.body.userName }
      },
      { upsert: true, setDefaultsOnInsert: true, new: true }
    )

    user.id = user._id.valueOf()
    await user.save()

    res.cookie('id', user.id)

    return res.json({})
  })
}
