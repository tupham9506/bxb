const fs = require('fs')

module.exports.page = () => {
  let template = fs.readFileSync(__dirname + '/page.html', { encoding: 'utf-8' });
  return template;
}