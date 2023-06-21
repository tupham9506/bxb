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
        document.querySelector('#dialog').innerHTML = `
        <div class="dialog">
        <div class="dialog-content card">
          <div class="status-text">${statusText}</div>
          <button type="button" class="btn full" onclick="$goRoomPage()">Về phòng chờ</button>
        </div>
      </div>
      `
        window.isGameOver = true
        return false
      }
      window.$players[data.id].ball.command[data.name](data)
    })
  })
}

window.buildGame = () => {
  window.isGameBuilt = true
  window.$pixi = new window.PIXI.Application({
    width: innerHeight * 1.6,
    height: innerHeight,
    background: '#FFFFFF',
    antialias: true,
    transparent: false,
    resolution: 1
  })

  const backgroundTexture = window.PIXI.Texture.from('assets/images/game-bg.avif')
  let background = new window.PIXI.Sprite(backgroundTexture)
  background.x = 0
  background.y = 0
  background.width = window.innerWidth
  background.height = window.innerHeight
  window.$pixi.stage.addChild(background)

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
    if (isMe) {
      document.querySelector('#bar-me').setAttribute('user-id', i)
    } else {
      document.querySelector('#bar-other').setAttribute('user-id', i)
      document.querySelector('.side .user-name').innerHTML = window.$players[i].userName
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
    if (event.which === 68) {
      window.$players[window.id].ball.ctrl.move({
        key: 'right'
      })
    }

    if (event.which === 87) {
      window.$players[window.id].ball.ctrl.move({
        key: 'up'
      })
    }

    if (event.which === 65) {
      window.$players[window.id].ball.ctrl.move({
        key: 'left'
      })
    }

    if (event.which === 83) {
      window.$players[window.id].ball.ctrl.move({
        key: 'down'
      })
    }
  })

  document.addEventListener('keyup', function (event) {
    if ([68, 65, 87, 83].indexOf(event.which) > -1) {
      window.$players[window.id].ball.ctrl.move({
        key: 'stop'
      })
    }
  })

  document.addEventListener('keypress', function (event) {
    if (event.which === 106) {
      return window.$players[window.id].ball.ctrl.s1()
    }
    if (event.keyCode === 107) {
      return window.$players[window.id].ball.ctrl.s2()
    }
    if (event.keyCode === 108) {
      return window.$players[window.id].ball.ctrl.s3()
    }
    if (event.keyCode === 111) {
      return window.$players[window.id].ball.ctrl.s4()
    }
  })

  // if (window.id !== window.$room.userId) {
  //   var count = 0
  //   setInterval(() => {
  //     window.$players[window.id].ball.ctrl.s1()
  //     window.$players[window.id].ball.ctrl.s2()
  //     window.$players[window.id].ball.ctrl.s3()
  //     if (count >= 100) {
  //       window.$players[window.id].ball.ctrl.move({
  //         key: 'right'
  //       })
  //       count--
  //     } else if (count <= 100) {
  //       window.$players[window.id].ball.ctrl.move({
  //         key: 'left'
  //       })
  //       count++
  //     }
  //   }, 1)
  // }
}

window.$command = data => {
  window.socket.emit('COMMAND', data)
}

window.$goSelectPage = () => {
  window.location.href = '/select'
}

window.$goRoomPage = () => {
  window.$helper.setCookie('roomId', '')
  window.location.href = '/room'
}
