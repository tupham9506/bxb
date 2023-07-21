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

  // if (window.$helper.isMobile()) {
  //   window.$reqFullScreen = () => {
  //     if (document.body.requestFullscreen) {
  //       document.body.requestFullscreen()
  //     } else if (document.body.webkitRequestFullscreen) {
  //       document.body.webkitRequestFullscreen()
  //     } else if (document.body.mozRequestFullScreen) {
  //       document.body.mozRequestFullScreen()
  //     } else if (document.body.msRequestFullscreen) {
  //       document.body.msRequestFullscreen()
  //     } else {
  //       alert('Trình duyệt của bạn không hỗ trợ. Vui lòng sử dụng chrome phiên bản mới nhất.')
  //       return false
  //     }
  //     document.querySelector('fullscreen-dialog').innerHTML = ''
  //     screen.orientation.lock('landscape')
  //   }
  //   window.onExitHandler = () => {
  //     if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
  //       document.querySelector('fullscreen-dialog').innerHTML = `
  //         <div class="dialog">
  //           <div class="dialog-content card">
  //             <div>Bạn đã thoát chế độ toàn màn hình</div>
  //             <button type="button" class="btn full" onclick="window.$reqFullScreen()">Bật toàn màn hình</button>
  //           </div>
  //         </div>
  //       `
  //     }
  //   }
  //   document.body.append(document.createElement('fullscreen-dialog'))
  //   document.addEventListener('fullscreenchange', window.onExitHandler, false)
  //   document.addEventListener('mozfullscreenchange', window.onExitHandler, false)
  //   document.addEventListener('MSFullscreenChange', window.onExitHandler, false)
  //   document.addEventListener('webkitfullscreenchange', window.onExitHandler, false)
  //   window.onExitHandler()
  // }
}
