function onSetup() {
  window.isGameOver = false;
  $players = null;
  try {
    $players = JSON.parse($helper.getCookie('players'));
  } catch (e) {
    $players = null;
  }

  if (!$players) {
    $helper.setCookie('roomId', '');
    window.location.href = '/room'
  }
  
  socket.on('COMMAND', data => {
    if (window.isGameOver) return false;

    if (data.name === 'gameOver') {
      const statusText = data.userId === window.userId ? '<div class="lose-text">You lose!</div>' : '<div class="win-text">You win</div>';
      $helper.setCookie('players', '');
      document.querySelector('#dialog').innerHTML = `
        <div class="dialog">
        <div class="dialog-content">
          <div class="status-text">${statusText}</div>
          <button type="button" class="btn full" onclick="$goSelectPage()">Đấu lại</button>
          <button type="button" class="btn full" onclick="$goRoomPage()">Về phòng chờ</button>
        </div>
      </div>
      `
      window.isGameOver = true;
      return false;
    }
    $players[data.userId].ball.command[data.name](data);
  });
 
  $pixi = new PIXI.Application({ 
    width: innerHeight * 1.6,
    height: innerHeight,
    background: '#FFFFFF',
  });

  document.querySelector('bxb').appendChild($pixi.view);

  $point = innerHeight / 100;
  $1_point = $point;
  $2_point = 2 * $point;
  $3_point = 3 * $point;
  $4_point = 4 * $point;
  $5_point = 5 * $point;
  $6_point = 6 * $point;
  $7_point = 7 * $point;
  $8_point = 8 * $point;
  $9_point = 9 * $point;
  $10_point = 10 * $point;
  $15_point = 15 * $point;
  $20_point = 20 * $point;
  $30_point = 30 * $point;
  $40_point = 40 * $point;
  $50_point = 50 * $point;
  $100_point = 100 * $point;

  for (let i in $players) {
    const isMe = window.userId === i;
    if (isMe) {
      document.querySelector('#bar-me').setAttribute('user-id', i);
    } else {
      document.querySelector('#bar-other').setAttribute('user-id', i);
      document.querySelector('.side .user-name').innerHTML = $players[i].userName;
    }

    $players[i].ball = new window[`Ball${$players[i].ballId}`]({
      userId: i,
      isMe: isMe, 
      x: window.roomId === i ? $10_point : $pixi.screen.width - $10_point,
      y: 100*$point/2,
      direct: window.roomId === i ? ['x', 1] : ['x', -1]
    });
  }

  document.addEventListener("keydown", function(event) {
    if (event.which == 68) {
      $players[userId].ball.ctrl.move({
        key: 'right'
      });
    }

    if (event.which == 87) {
      $players[userId].ball.ctrl.move({
        key: 'up'
      });
    }

    if (event.which == 65) {
      $players[userId].ball.ctrl.move({
        key: 'left'
      });
    }

    if (event.which == 83) {
      $players[userId].ball.ctrl.move({
        key: 'down'
      });
    }
  });

  document.addEventListener("keyup", function(event) {
    if ([68, 65, 87, 83].indexOf(event.which) > -1) {
      $players[userId].ball.ctrl.move({
        key: 'stop'
      });
    }
  });

  document.addEventListener("keypress", function(event) {
    if (event.which == 106) {
      return $players[userId].ball.ctrl.s1();
    }
    if (event.keyCode === 107) {
      return $players[userId].ball.ctrl.s2();
    }
    if (event.keyCode === 108) {
      return $players[userId].ball.ctrl.s3();
    }
    if (event.keyCode === 111) {
      return $players[userId].ball.ctrl.s4();
    }
  });
  
  // window.onbeforeunload = function() {  
  //   $helper.setCookie('roomId', '');
  //   $helper.setCookie('players', '');
  //   return "";
  // }
}

function $command (data) {
  socket.emit('COMMAND', data);
}

function $goSelectPage () {
  window.location.href = '/select';
}

function $goRoomPage () {
  $helper.setCookie('roomId', '');
  window.location.href = '/room';
}