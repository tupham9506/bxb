window.onSetup = () => {
  window.socket.on('connect', () => {
    window.socket.on('USER_LIST', data => {
      let template = ``
      data.forEach(item => {
        template += `
          <div class="user-item">
            <div class="user-name">${item.userName}</div>
            <div class="user-id">${item.id}</div>
          </div>
        `
      })
      document.querySelector('#userList').innerHTML = template
    })

    window.socket.on('ROOM_LIST', data => {
      let template = ``
      data.forEach(item => {
        template += `
          <div class="room-item card" onclick="joinRoom('${item.id}')">
            <div class="user-name">${item.roomName}</div>
            <div class="user-number"><img src="assets/images/character.svg"><div>${
              Object.keys(item.players).length || 0
            } / 2</div></div>
          </div>
        `
      })
      document.querySelector('#roomList').innerHTML = template
    })

    window.socket.on('JOIN_ROOM', () => {
      window.location.href = '/select'
    })
  })

  window.socket.on('CREATE_ROOM', () => {
    window.location.href = '/select'
  })
}

window.joinRoom = id => {
  window.socket.emit('JOIN_ROOM', { id })
}

window.createRoom = () => {
  window.socket.emit('CREATE_ROOM')
}
