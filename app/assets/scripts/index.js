window.onload = () => {
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
}
