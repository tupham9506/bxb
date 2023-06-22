window.room = null

window.onSetup = () => {
  let ballTemplate = ''
  for (let i in window.BALLS) {
    ballTemplate += `
      <div class="ball-item card" onmouseenter="buildSkillDesciption(${i}, this)" onmouseleave="buildSkillDesciption(0, this)" onclick="selectBall(${i}, this)">
        <img src="${window.BALLS[i].image}" />
        <div class="ball-item-description"></div>
      </div>
    `
  }

  document.querySelector('#ball .ball-container').innerHTML = ballTemplate

  window.socket.on('connect', () => {
    window.socket.on('ROOM_DETAIL', data => {
      if (!data) return

      window.room = data
      if (window.room.status === 2) {
        window.location.href = '/game'
      }

      for (let i in data.players) {
        let player = data.players[i]

        if (window.id === player.id) {
          document.querySelector('#player1 .user-name').innerHTML = player.userName
          document.querySelector('#player1').setAttribute('user-id', player.id)
        } else {
          document.querySelector('#player2 .user-name').innerHTML = player.userName
          document.querySelector('#player2').setAttribute('user-id', player.id)
        }

        if (player.isKey) {
          document.querySelector('.guide').innerHTML =
            'Lựa chọn nhân vật bóng, chờ đối thủ sẵn sàng và ấn nút "Bắt đầu" trận đấu.'
          if (player.id === window.id) {
            document.querySelector('.ready-button').innerHTML = 'Bắt đầu'
          }
        } else {
          document.querySelector('.guide').innerHTML =
            'Lựa chọn nhân vật bóng sau đó bấm vào nút "Sẵn sàng". Chờ đợi chủ phòng bắt đầu trận đấu.'
        }

        if (window.id !== window.room.userId) {
          if (player.id === window.id && player.status === 1) {
            document.querySelector('.ready-button').innerHTML = 'Đã sẵn sàng'
          }
        } else {
          if (player.status === 1) {
            document.querySelector('.ready-status').innerHTML = '<div class="ready-true">Đã sẵn sàng</div>'
          } else {
            document.querySelector('.ready-status').innerHTML = '<div class="ready-false">Chưa sẵn sàng</div>'
          }
        }

        if (player.ballId) buildSelectBall(player.id, player.ballId)
      }
    })

    if (!window.$helper.getCookie('isReadGuide')) {
      document.querySelector('.guide-dialog').style.display = 'flex'
      window.$helper.setCookie('isReadGuide', 1)
    }

    document.querySelector('.loading-bg').remove()
  })

  window.socket.on('READY', () => {
    if (window.id === window.roomId) {
      document.querySelector('.ready-status').innerHTML = '<div class="ready-true">Đã sẵn sàng</div>'
    }
  })

  window.socket.on('SELECT_BALL', data => {
    buildSelectBall(data.id, data.ballId)
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
  document.querySelector(`[user-id="${id}"] .selected-ball-container`).innerHTML = `
    <div class="animate__pulse selected-ball-item">
      <img src="components/balls/${ballId}/ball.svg">
    <div>
  `
}

window.buildSkillDesciption = (ballId, self) => {
  let ballSelector = self.querySelector('.ball-item-description')
  if (!ballId) {
    return (ballSelector.innerHTML = ``)
  }

  if (ballSelector.innerHTML) return false

  const ball = window.BALLS[ballId]
  let skillTemplate = ''

  for (let i in ball.skills) {
    let skill = ball.skills[i]

    skillTemplate += `
      <div class="control-guide-content s1">
        <div class="control-guide-header">
          <div class="skill-image"><img src="${skill.image}"></div>
          <div>
            <div class="skill-name">${skill.name}</div>
            <div class="skill-desciption">${skill.description}</div>
          </div>
        </div>
      </div>
    `
  }

  ballSelector.innerHTML = `
    <div class="selected-ball card">
      <div class="selected-ball-header">
        <div class="img-container">
          <img src="components/balls/${ballId}/ball.svg">
        </div>
        <div class="detail-container">
          <div class="ball-name-container">
            <div class="ball-name">${ball.name}</div>
            <div class="ball-nickname">${ball.nickname}</div>
          </div>
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
          </table>
        </div> 
      </div>
      

      <div class="skill">${skillTemplate}</div>
    </div>
  `
}

function getIndexPercent(type, value) {
  return (value * 100) / 10
}

window.closeGuide = () => {
  document.querySelector('.guide-dialog').style.display = 'none'
}

window.startGame = () => {
  return window.socket.emit('START_GAME')
}
