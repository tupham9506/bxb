window.userId = null;
window.userName = null;
window.roomId = null;
window.socket = null;
window.onload = () => {
  userId = $helper.getCookie('userId'),
  userName = $helper.getCookie('userName')
  roomId = $helper.getCookie('roomId')
  socket = io("ws://" + window.location.host, {
    reconnectionDelayMax: 10000,
    auth: {
      userId: window.userId,
      userName: window.userName,
      roomId: window.roomId
    }
  });
  if (typeof onSetup === 'function') {
    onSetup();
  }
};