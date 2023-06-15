var path = require("path");
const User = require('./../../models/users')

module.exports = (app) => {
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+ '/page.html'));
  });

  app.get('/api/user', async (req, res) => {
    return res.json({
      data: await User.findOne({
      _id: req.userId
    })})
  });

  app.post('/api/start', async (req, res) => {
    if (!req.cookies.userId) {
      const user = (await User.create({
        userName: req.body.userName
      }));

      res.cookie('userId', user._id.valueOf())
    }
    return res.json({});
  });
}
