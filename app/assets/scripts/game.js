window.onSetup = () => {
  window.isGameOver = false
  window.isGameBuilt = false
  window.socket.on('connect', () => {
    window.socket.on('ROOM_DETAIL', data => {
      if (!data) window.location.href = '/room'
      if (data.status === 1) window.location.href = '/select'

      if (!window.isGameBuilt) {
        window.$room = data
        window.$players = window.$room.players
        window.buildGame()
      }
    })
    window.socket.on('COMMAND', data => {
      if (window.isGameOver) return false

      if (data.name === 'gameOver') {
        const statusText =
          data.id === window.id ? '<div class="lose-text">You lose!</div>' : '<div class="win-text">You win</div>'
        window.$helper.setCookie('players', '')
        window.openDialog(statusText)
        window.isGameOver = true
        return false
      }
      window.$players[data.id].ball.command[data.name](data)
    })
  })

  setTimeout(() => {
    document.querySelector('.loading-bg').remove()
  }, 1000)
}

window.buildGame = () => {
  window.isGameBuilt = true
  window.$width = window.innerHeight * 1.8
  window.$height = window.innerHeight
  window.$pixi = new window.PIXI.Application({
    width: window.$width,
    height: window.$height,
    background: '#DBDEE1',
    antialias: true,
    transparent: false,
    resolution: 1
  })

  document.querySelector('bxb').appendChild(window.$pixi.view)

  window.$point = innerHeight / 100
  window.$1_point = window.$point
  window.$2_point = 2 * window.$point
  window.$3_point = 3 * window.$point
  window.$4_point = 4 * window.$point
  window.$5_point = 5 * window.$point
  window.$6_point = 6 * window.$point
  window.$7_point = 7 * window.$point
  window.$8_point = 8 * window.$point
  window.$9_point = 9 * window.$point
  window.$10_point = 10 * window.$point
  window.$15_point = 15 * window.$point
  window.$20_point = 20 * window.$point
  window.$30_point = 30 * window.$point
  window.$40_point = 40 * window.$point
  window.$50_point = 50 * window.$point
  window.$100_point = 100 * window.$point

  for (let i in window.$players) {
    const isMe = window.id === i
    if (window.$players[i].isKey) {
      document.querySelector('#bar-key').setAttribute('user-id', i)
      document.querySelector('#bar-key .user-name').innerHTML = window.$players[i].userName
    } else {
      document.querySelector('#bar-other').setAttribute('user-id', i)
      document.querySelector('#bar-other .user-name').innerHTML = window.$players[i].userName
    }

    window.$players[i].ball = new window[`Ball${window.$players[i].ballId}`]({
      id: i,
      isMe: isMe,
      x: window.$players[i].isKey ? window.$10_point : window.$pixi.screen.width - window.$10_point,
      y: (100 * window.$point) / 2,
      direct: window.$players[i].isKey ? ['x', 1] : ['x', -1]
    })
  }

  document.addEventListener('keydown', event => {
    if (['d', 'đ', 'D', 'Đ'].indexOf(event.key) > -1) {
      return window.$commandMove('right')
    }

    if (['a', 'A'].indexOf(event.key) > -1) {
      return window.$commandMove('left')
    }

    if (['w', 'ư', 'Ư', 'W'].indexOf(event.key) > -1) {
      return window.$commandMove('up')
    }

    if (['s', 'S'].indexOf(event.key) > -1) {
      return window.$commandMove('down')
    }
  })

  document.addEventListener('keyup', function (event) {
    if (['d', 'đ', 'D', 'Đ'].indexOf(event.key) > -1) {
      return window.$commandMoveStop('right')
    }

    if (['a', 'A'].indexOf(event.key) > -1) {
      return window.$commandMoveStop('left')
    }

    if (['w', 'ư', 'Ư', 'W'].indexOf(event.key) > -1) {
      return window.$commandMoveStop('up')
    }

    if (['s', 'S'].indexOf(event.key) > -1) {
      return window.$commandMoveStop('down')
    }
  })

  document.addEventListener('keypress', function (event) {
    if (['j', 'J'].indexOf(event.key) > -1) {
      return window.$players[window.id].ball.ctrl.s1()
    }
    if (['k', 'K'].indexOf(event.key) > -1) {
      return window.$players[window.id].ball.ctrl.s2()
    }
    if (['l', 'L'].indexOf(event.key) > -1) {
      return window.$players[window.id].ball.ctrl.s3()
    }
    if (['o', 'ô', 'O', 'Ô'].indexOf(event.key) > -1) {
      return window.$players[window.id].ball.ctrl.s4()
    }
  })
}

window.$commandMove = key => {
  return window.$players[window.id].ball.ctrl.move({
    key: key
  })
}

window.$commandMoveStop = key => {
  return window.$players[window.id].ball.ctrl.move({
    key: key,
    name: 'stop'
  })
}

window.$command = data => {
  window.socket.emit('COMMAND', data)
}

window.$goRoomPage = () => {
  window.location.href = '/room'
}

window.onbeforeunload = function () {
  window.$command({
    name: 'gameOver',
    id: window.id
  })

  return 'Are you sure want to LOGOUT the session ?'
}

window.openDialog = title => {
  document.querySelector('#dialog').innerHTML = `
  <div class="dialog">
    <div class="dialog-content card">
      <div class="dialog-close" onclick="closeDialog()">X</div>
      <div class="status-text">${title}</div>
      <button type="button" class="btn full" onclick="$goRoomPage()">Về phòng chờ</button>
    </div>
  </div>
`
}

window.closeDialog = () => {
  document.querySelector('#dialog').innerHTML = ''
}
