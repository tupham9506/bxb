const fs = require('fs');

module.exports = {
  index: (req) => {
    var players = {};
    try {
      players = JSON.parse(req.cookies.players);
    } catch (e) {
      players = {};
    }
    
    let content = fs.readFileSync(__dirname + '/game.html', {encoding: 'utf-8'});
    let replacer = '';
    const ballIds = [];
    for (let i in players) {
      if (ballIds.indexOf(players[i].ballId) === -1) ballIds.push(players[i].ballId);
    }

    for (let ballId of ballIds) {
      replacer += `
      <script src="components/balls/${ballId}/index.js"></script>
      `
    }
    content = content.replace('<bxb-script></bxb-script>', replacer)

    return content
  }
}