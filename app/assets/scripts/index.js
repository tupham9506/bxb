window.onload = () => {
  console.log('1')
  window.id = window.$helper.getCookie('id')
  window.socket = window.io('ws://' + window.location.host, {
    reconnectionDelayMax: 10000,
    auth: {
      id: window.id
    }
  })
  var audio = new Audio('/assets/sounds/click.mp3')

  document.body.addEventListener(
    'click',
    function () {
      audio.play()
    },
    true
  )

  if (typeof window.onSetup === 'function') {
    window.onSetup()
  }

  window.addEventListener('resize', onResize)
  onResize()

  window.$reqFullScreen = () => {
    document.body.requestFullscreen()
    screen.orientation.lock('landscape')
    document.querySelector('fullscreen-dialog').innerHTML = ''
  }

  if (window.$helper.isMobile) {
    document.body.append(document.createElement('fullscreen-dialog'))
    document.addEventListener('fullscreenchange', window.exitHandler, false)
    document.addEventListener('mozfullscreenchange', window.exitHandler, false)
    document.addEventListener('MSFullscreenChange', window.exitHandler, false)
    document.addEventListener('webkitfullscreenchange', window.exitHandler, false)
    window.exitHandler()
  }
  window.exitHandler = () => {
    console.log(document.webkitIsFullScreen)
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
      document.querySelector('fullscreen-dialog').innerHTML = `
        <div class="dialog">
          <div class="dialog-content card">
            <div>Bạn đã thoát chế độ toàn màn hình</div>
            <button type="button" class="btn full" onclick="window.$reqFullScreen()">Bật toàn màn hình</button>
          </div>
        </div>
      `
    }
  }
}

function onResize() {
  if (window.innerHeight > window.innerWidth) {
    alert('Vui lòng xoay ngang thiết bị của bạn để bắt đầu trò chơi')
  }
}
