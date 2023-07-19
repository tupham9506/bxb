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
}

function onResize() {
  if (window.innerHeight > window.innerWidth) {
    alert('Vui lòng xoay ngang thiết bị của bạn để bắt đầu trò chơi')
  }
}
