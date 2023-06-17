window.onload = () => {
  window.id = window.$helper.getCookie('id')
  window.socket = window.io('ws://' + window.location.host, {
    reconnectionDelayMax: 10000,
    auth: {
      id: window.id
    }
  })
  if (typeof window.onSetup === 'function') {
    window.onSetup()
  }
}
