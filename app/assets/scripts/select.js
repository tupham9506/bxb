window.isPlayerReady = false
window.ball = false

window.onSetup = () => {
  let ballTemplate = ''
  for (let i in window.BALLS) {
    ballTemplate += `
      <div class="ball-item" onclick="selectBall(${i}, this)">
        <img src="${window.BALLS[i].image}" />
      </div>
    `
  }

  document.querySelector('#ball .ball-container').innerHTML = ballTemplate

  if (window.id === window.roomId) {
    document.querySelector('#player1 .ready-button').innerHTML = 'Bắt đầu'
    document.querySelector('.guide').innerHTML =
      '* Lựa chọn nhân vật bóng, chờ đối thủ sẵn sàng và ấn nút "Bắt đầu" trận đấu.'
    document.querySelector('.ready-status').innerHTML = '<div class="ready-false">Chưa sẵn sàng</div>'
  } else {
    document.querySelector('.guide').innerHTML =
      '* Lựa chọn nhân vật bóng sau đó bấm vào nút "Sẵn sàng". Chờ đợi chủ phòng bắt đầu trận đấu.'
  }

  window.socket.on('connect', () => {
    window.socket.on('ROOM_DETAIL', data => {
      if (!data) return

      for (let i in data.players) {
        let player = data.players[i]

        if (window.id === player.id) {
          document.querySelector('#player1 .user-name').innerHTML = player.userName
          document.querySelector('#player1').setAttribute('user-id', player.id)
        } else {
          document.querySelector('#player2 .user-name').innerHTML = player.userName
          document.querySelector('#player2').setAttribute('user-id', player.id)
        }

        if (player.ballId) buildSelectBall(player.id, player.ballId)
      }
    })
  })

  window.socket.on('READY', () => {
    isPlayerReady = true
    if (window.id === window.roomId) {
      document.querySelector('.ready-status').innerHTML = '<div class="ready-true">Đã sẵn sàng</div>'
    }
  })

  window.socket.on('SELECT_BALL', data => {
    buildSelectBall(data.id, data.ballId)
  })

  window.socket.on('START_GAME', () => {
    window.location.href = '/game'
  })
}

window.selectBall = (id, self) => {
  for (let element of document.querySelectorAll('.ball-item')) {
    element.classList.remove('active-1')
  }
  self.classList.add('active-1')
  window.socket.emit('SELECT_BALL', {
    ballId: id
  })
}

function buildSelectBall(id, ballId) {
  const ball = window.BALLS[ballId]
  let skillTemplate = ''
  for (let skill of ball.skills) {
    skillTemplate += `
        <div class="skill-image"><img src="${skill.image}"></div>
        `
  }

  let template = `
        <div class="selected-ball">
          <div class="ball-name">
            <div>${ball.name}</div>
            <div class="ball-nickname">${ball.nickname}</div>
          </div>
          <div class="ball-image"><img src="${ball.image}"></div>
          <table class="skill-table">
            <tr>
              <td class="skill-title"><img src="assets/images/hearts.svg"></td>
              <td>
                <div class="index-container">
                  <div class="index" style="width:${getIndexPercent('hp', ball.hp)}%"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="skill-title"><img src="assets/images/two-handed-sword.svg"></td>
              <td>
                <div class="index-container">
                  <div class="index" style="width:${getIndexPercent('strength', ball.strength)}%"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="skill-title"><img src="assets/images/arrow-dunk.svg"></td>
              <td>
                <div class="index-container">
                  <div class="index" style="width:${getIndexPercent('range', ball.range)}%"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="skill-title"><img src="assets/images/run.svg"></td>
              <td>
                <div class="index-container">
                  <div class="index" style="width:${getIndexPercent('speed', ball.speed)}%"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2"><div class="skill">${skillTemplate}</div></td>
            </tr>
          </table>
        </div>
      `

  document.querySelector(`[user-id="${id}"] .selected-ball-container`).innerHTML = template
}

function getIndexPercent(type, value) {
  return (value * 100) / 10
}

window.startGame = () => {
  if (window.id == window.roomId) {
    if (!isPlayerReady) return false
    for (let i in window.players) {
      if (!window.players[i].ballId) return false
    }
    return window.socket.emit('START_GAME')
  }
  if (!window.players[id].ballId) return false
  document.querySelector('.ready-button').innerHTML = 'Đã sẵn sàng'
  window.socket.emit('READY')
}
