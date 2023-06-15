const services = require('./service');

module.exports = (app) => {
  app.get('/story', function (req, res) {
    return res.send(services.page());
  });
}
