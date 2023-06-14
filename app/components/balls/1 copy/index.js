function Ball2 (config = {}) {
  const namespace = 'components/balls/2/';
  const self = this;
  
  // Ball info
  self.hp = 1500;
  self.hpTotal = 1500;
  self.speed = $point;
  self.direct = config.direct;
  self.isLockMove = false;
  self.isLockSkill = false;
  self.ctrl = {};
  self.command = {};
  self.isAtk = false;

  // Ball container
  self.container = new PIXI.Container();
  $pixi.stage.addChild(self.container);
  self.container.x = config.x || 0;
  self.container.y = config.y || 0;

  self.ball = PIXI.Sprite.from(namespace + 'ball.svg');
  self.ball.width = $10_point;
  self.ball.height = $10_point;
  self.ball.anchor.set(0.5);

  self.weapon = PIXI.Sprite.from(namespace + 'weapon.svg');
  self.weapon.width = $5_point;
  self.weapon.height = $20_point;
  self.weapon.x = +self.ball.width/2;
  self.weapon.anchor.set(0.5, 0);

  self.container.addChild(self.ball);
  self.container.addChild(self.weapon);
  self.text = null;
  var currentMove = null
  var currentMoveId = null
  
  // Controll define
  self.ctrl.left = () => {
    if (self.container.x <= 0) return;
    if (self.isLockMove) return;
    self.container.x -= self.speed;
    self.direct = ['x', -1];
    $command({
      userId: config.userId,
      name: 'position',
      x: (self.container.x/$point),
      y: (self.container.y/$point),
      direct: self.direct 
    })
    currentMoveId = requestAnimationFrame(self.ctrl.left);
  }

  self.ctrl.right = () => {
    if (self.container.x + self.ball.width >= $pixi.screen.width) return;
    if (self.isLockMove) return;
    self.container.x += self.speed;
    self.direct = ['x', +1];
    $command({
      userId: config.userId,
      name: 'position',
      x: (self.container.x/$point),
      y: (self.container.y/$point),
      direct: self.direct 
    })
    currentMoveId = requestAnimationFrame(self.ctrl.right);
  }
  
  self.ctrl.up = () => {
    if (self.container.y <= 0) return;
    if (self.isLockMove) return;
    self.container.y -= self.speed;
    self.direct = ['y', -1];
    $command({
      userId: config.userId,
      name: 'position',
      x: (self.container.x/$point),
      y: (self.container.y/$point),
      direct: self.direct 
    })
    currentMoveId = requestAnimationFrame(self.ctrl.up);
  }

  self.ctrl.down = () => {
    if (self.container.y + self.ball.height >= $pixi.screen.height) return;
    if (self.isLockMove) return;
    self.container.y += self.speed;
    self.direct = ['y', +1];
    $command({
      userId: config.userId,
      name: 'position',
      x: (self.container.x/$point),
      y: (self.container.y/$point),
      direct: self.direct 
    })
    currentMoveId = requestAnimationFrame(self.ctrl.down);
  }

  self.ctrl.move = (data) => {
    if (!self.isAtk) {
      self.buildWeaponPosition();
    }
    if (currentMove && data.key != currentMove) {
      cancelAnimationFrame(currentMoveId);
    }
    if (data.key === 'stop') {
      currentMove = null;
      cancelAnimationFrame(currentMoveId);
      return;
    }
    if (currentMove === data.key) return;


    currentMove = data.key;
    currentMoveId = requestAnimationFrame(self.ctrl[data.key]);
  }

  self.command.position = (data) => {
    if (config.isMe) return false;
    self.container.x = data.x * $point;
    self.container.y = data.y * $point;
    self.direct = data.direct;
  }

  self.command.text = (data) => {
    const style = data.style || {};
    const time = data.time || 1000;
    if (self.text) {
      self.container.removeChild(self.text);
      self.text = null;
    }
    self.text = new PIXI.Text(data.title, style);
    self.text.x = self.container.width
    self.container.addChild(self.text);
    setTimeout(() => {
      self.container.removeChild(self.text);
      self.text = null;
    }, time)
  }

  self.command.hp = (data) => {
    self.hp += data.hp;
    self.command.text({
      title: data.hp,
      style: {
        fill: '0xFF0000',
        fontSize: $2_point
      }
    })

    self.buildHp();

    if (self.hp <= 0) {
      $command({
        name: 'gameOver',
        userId: config.userId,
      })
    }
  }

  self.buildWeaponPosition = () => {
    const position = $helper.positionWeaponByDirect(self.direct, self.ball);
     self.weapon.angle = position.angle;
     self.weapon.x = position.x;
     self.weapon.y = position.y;
  }

  self.buildHp = () => {
    const hpSelector = document.querySelector(`[user-id="${config.userId}"] .hp-bar-remain`);
    if (hpSelector) {
      hpSelector.style.height = (self.hp / self.hpTotal) * 100 + '%';
    }
  }

  self.buildSkill = () => {
    if (!config.isMe) return false;
    document.querySelector('.untimate .skill-1').innerHTML = `<img src="${namespace}/s1-icon.svg">`
    document.querySelector('.untimate .skill-2').innerHTML = `<img src="${namespace}/s2-icon.svg">`
    document.querySelector('.untimate .skill-3').innerHTML = `<img src="${namespace}/s3-icon.svg">`
    document.querySelector('.untimate .untimate-skill').innerHTML = `<img src="${namespace}/s4-icon.svg">`
  }

  // S1
  const s1 = {
    isEnabled: true,
    atk: 90,
    speed: 5,
    angle: 90
  }

  self.ctrl.s1 = () => {
    if (config.isMe) {
      if (!s1.isEnabled) return;
      if (self.isLockSkill) return;
  
      $command({
        userId: window.userId,
        name: 's1'
      })
      s1.isEnabled = false;
      self.isAtk = true;
    }
    
    let count = 0;
    var isHit = false;
    const currenDirect = [...self.direct];

    requestAnimationFrame(function start () {
      if (!isHit) {
        for (let i in $players) {
          if (i == config.userId) continue;
          isHit = $helper.isHit(self.weapon, $players[i].ball.ball);

          if (config.isMe && isHit) {
            $command({
              name: 'hp',
              hp: -s1.atk,
              userId: i,
            });
            break;
          };
        }
      }

      self.weapon.angle += currenDirect[1] * s1.speed;
      count += s1.speed;

      if (count >= s1.angle) {
        s1.isEnabled = true;
        self.isAtk = false;
        self.buildWeaponPosition()
        return true;
      }
      
      requestAnimationFrame(start);
    })
  };

  self.command.s1 = () => {
    self.ctrl.s1();
  }

  // S2
  const s2 = {
    src: PIXI.Sprite.from(namespace + 's2.svg'),
    isEnabled: true,
    atk: 10,
    speed: $1_point,
    range: $100_point
  }

  s2.src.width = $10_point;
  s2.src.height = $10_point;
  s2.src.anchor.set(0.5);

  self.ctrl.s2 = () => {
    if (config.isMe) {
      if (!s2.isEnabled) return;
      if (self.isLockSkill) return;
  
      $command({
        userId: window.userId,
        name: 's2'
      })
      s2.isEnabled = false;
    }
    
    const currenDirect = [...self.direct];
    const anchor = $helper.anchor(self.container, self.ball, currenDirect, s2.src)
    s2.src.x = anchor.x;
    s2.src.y = anchor.y;
    s2.src.angle = $helper.angleByDirect(currenDirect);
    $pixi.stage.addChild(s2.src);

    let count = 0;
    var isHit = false;

    requestAnimationFrame(function start () {
      if (!isHit) {
        for (let i in $players) {
          if (i == config.userId) continue;
          isHit = $helper.isHit(s2.src, $players[i].ball.ball);

          if (config.isMe && isHit) {
            $command({
              name: 'hp',
              hp: -s2.atk,
              userId: i,
            });
            break;
          };
        }
      }

      s2.src[currenDirect[0]] = s2.src[currenDirect[0]] + currenDirect[1] * s2.speed;

      count += s2.speed;
      if (isHit || count >= s2.range) {
        $pixi.stage.removeChild(s2.src);
        if (count >= $50_point) {
          s2.isEnabled = true;
          self.buildWeaponPosition();
          return true;
        }
      }
      
      requestAnimationFrame(start);
    })
  };

  self.command.s2 = () => {
    self.ctrl.s2();
  }

  // S3
  const s3 = {
    src: PIXI.Sprite.from(namespace + 's3.svg'),
    isEnabled: true,
    atk: 150,
    speed: $1_point,
    range: $40_point,
    endSrc: PIXI.Sprite.from(namespace + 's3-end.svg'),
    endSize: $20_point,
    endTime: 1,
  }

  s3.src.width = $10_point;
  s3.src.height = $10_point;
  s3.src.anchor.set(0.5);
  s3.endSrc.width = $10_point;
  s3.endSrc.height = $10_point;
  s3.endSrc.anchor.set(0.5);

  self.ctrl.s3 = () => {
    if (config.isMe) {
      if (!s3.isEnabled) return;
      if (self.isLockSkill) return;
  
      $command({
        userId: window.userId,
        name: 's3'
      })
      s3.isEnabled = false;
    }
    
    const currenDirect = [...self.direct];
    const anchor = $helper.anchor(self.container, self.ball, currenDirect, s3.src)
    s3.src.x = anchor.x;
    s3.src.y = anchor.y;
    s3.src.angle = $helper.angleByDirect(currenDirect);
    $pixi.stage.addChild(s3.src);

    let count = 0;
    var isHit = false;

    requestAnimationFrame(function start () {
      s3.src[currenDirect[0]] = s3.src[currenDirect[0]] + currenDirect[1] * s3.speed;
      s3.src.rotation += .1;

      count += s3.speed;
      if (count >= s3.range) {
        $pixi.stage.removeChild(s3.src);
        s3.endSrc.x = s3.src.x;
        s3.endSrc.y = s3.src.y
        requestAnimationFrame(end);
        return true;
      }
      
      requestAnimationFrame(start);
    })

    function end () {
      $pixi.stage.addChild(s3.endSrc);
      if (!isHit) {
        for (let i in $players) {
          if (i == config.userId) continue;
          isHit = $helper.isHit(s3.endSrc, $players[i].ball.ball);
          if (config.isMe && isHit) {
            $command({
              name: 'hp',
              hp: -s3.atk,
              userId: i,
            });
            break;
          };
        }
      }

      s3.endSrc.width += 0.5*$1_point;
      s3.endSrc.height += 0.5*$1_point;

      if (s3.endSrc.width >= s3.endSize) {
        setTimeout(() => {
          $pixi.stage.removeChild(s3.endSrc);
          s3.endSrc.width = $10_point;
          s3.endSrc.height = $10_point;
          s3.isEnabled = true;
        }, s3.endTime * 1000)
        return true;
      }
      requestAnimationFrame(end);
    }
  };

  self.command.s3 = () => {
    self.ctrl.s3();
  }

  // S4
  const s4 = {
    src: PIXI.Sprite.from(namespace + 's4.svg'),
    isEnabled: true,
    atk: 500,
    speed: $2_point
  }

  s4.src.width = $40_point;
  s4.src.height = $40_point;
  s4.src.anchor.set(0.5);

  self.ctrl.s4 = () => {
    if (config.isMe) {
      if (!s4.isEnabled) return;
      if (self.isLockSkill) return;
  
      $command({
        userId: window.userId,
        name: 's4'
      })
      s4.isEnabled = false;
    }
    
    const currenDirect = [...self.direct];
    const anchor = $helper.anchor(self.container, self.ball, currenDirect, s4.src)
    s4.src.x = anchor.x;
    s4.src.y = anchor.y;
    s4.src.angle = $helper.angleByDirect(currenDirect);
    $pixi.stage.addChild(s4.src);
    $pixi.renderer.backgroundColor = '#000000';
    let count = 0;
    var isHit = false;

    requestAnimationFrame(function start () {
      if (!isHit) {
        for (let i in $players) {
          if (i == config.userId) continue;
          isHit = $helper.isHit(s4.src, $players[i].ball.ball);
          if (config.isMe && isHit) {
            $command({
              name: 'hp',
              hp: -s4.atk,
              userId: i,
            });
            break;
          };
        }
      }

      s4.src[currenDirect[0]] = s4.src[currenDirect[0]] + currenDirect[1] * s4.speed;
      count += s4.speed;
      if (isHit || count >= 2*$100_point) {
        $pixi.stage.removeChild(s4.src);
        if (count >= $100_point) {
          s4.isEnabled = true;
          $pixi.renderer.backgroundColor = '#FFFFFF';
          return true;
        }
      }
      
      requestAnimationFrame(start);
    })
  };

  self.command.s4 = () => {
    self.ctrl.s4();
  }

  self.buildWeaponPosition();
  self.buildHp();
  self.buildSkill();
}