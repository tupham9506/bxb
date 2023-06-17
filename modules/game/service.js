const fs = require('fs')
const User = require('../../models/user')
const Room = require('../../models/room')

module.exports = {
  index: async req => {
    let content = fs.readFileSync(__dirname + '/game.html', { encoding: 'utf-8' })

    const user = await User.findOne({ _id: req.cookies.id })

    if (!user || !user.roomId) return content

    const room = await Room.findOne({ _id: user.roomId })

    let replacer = ''
    const ballIds = []

    for (let i in room.players) {
      if (ballIds.indexOf(room.players[i].ballId) === -1) ballIds.push(room.players[i].ballId)
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
