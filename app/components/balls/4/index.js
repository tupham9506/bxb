// eslint-disable-next-line no-unused-vars
function Ball4(config = {}) {
  const namespace = 'components/balls/4/'
  const self = this

  // Ball info
  self.hp = 1150
  self.hpTotal = 1200
  self.speed = window.$point * 1.1
  self.direct = config.direct
  self.isLockMove = false
  self.isLockSkill = false
  self.ctrl = {}
  self.command = {}
  self.isAtk = false
  self.config = config

  // Ball container
  self.container = new window.PIXI.Container()
  window.$pixi.stage.addChild(self.container)
  self.container.x = config.x || 0
  self.container.y = config.y || 0

  const ballTexture = window.PIXI.Texture.from(namespace + 'ball.svg')

  self.ball = new window.PIXI.Sprite(ballTexture)
  self.ball.width = window.$10_point
  self.ball.height = window.$10_point
  self.ball.anchor.set(0.5)

  const weaponTexture = window.PIXI.Texture.from(namespace + 'weapon.svg')
  self.weapon = new window.PIXI.Sprite(weaponTexture)
  self.weapon.width = window.$3_point
  self.weapon.height = window.$15_point
  self.weapon.x = +self.ball.width / 2
  self.weapon.anchor.set(0.5, 0)

  const s1Texture = window.PIXI.Texture.from(namespace + 's1.svg')
  const s2Texture = window.PIXI.Texture.from(namespace + 's2.svg')
  const s4Texture = window.PIXI.Texture.from(namespace + 's4.svg')

  self.container.addChild(self.ball)
  self.container.addChild(self.weapon)
  window.$helper.buildArrow(self)

  self.text = null
  let currentKey = null
  let move = {
    up: false,
    down: false,
    left: false,
    right: false
  }

  // Control define
  self.ctrl.left = delta => {
    if (self.isLockMove || self.isSuperLockMove || currentKey !== 'left') return
    if (self.container.x - window.$point - self.ball.width / 2 <= 0) return
    self.container.x -= delta * self.speed
    self.direct = ['x', -1]
    window.$helper.showArrow(self)
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
  }

  self.ctrl.right = delta => {
    if (self.isLockMove || self.isSuperLockMove || currentKey !== 'right') return
    if (self.container.x + window.$point + self.ball.width / 2 >= window.$pixi.screen.width) return
    self.container.x += delta * self.speed
    self.direct = ['x', +1]
    window.$helper.showArrow(self)
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
  }

  self.ctrl.up = delta => {
    if (self.isLockMove || self.isSuperLockMove || currentKey !== 'up') return
    if (self.container.y - window.$point - self.ball.height / 2 <= 0) return
    self.container.y -= delta * self.speed
    self.direct = ['y', -1]
    window.$helper.showArrow(self)
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
  }

  self.ctrl.down = delta => {
    if (self.isLockMove || self.isSuperLockMove || currentKey !== 'down') return
    if (self.container.y + window.$point + self.ball.height / 2 >= window.$pixi.screen.height) return
    self.container.y += delta * self.speed
    self.direct = ['y', +1]
    window.$helper.showArrow(self)
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
  }

  let moveTicker = {
    up: new window.PIXI.Ticker().add(self.ctrl.up),
    down: new window.PIXI.Ticker().add(self.ctrl.down),
    left: new window.PIXI.Ticker().add(self.ctrl.left),
    right: new window.PIXI.Ticker().add(self.ctrl.right)
  }

  function stopMove() {
    for (let i in move) {
      if (move[i]) {
        moveTicker[i].stop()
        move[i] = false
      }
    }
  }

  self.ctrl.move = data => {
    if (!self.isAtk) {
      self.buildWeaponPosition()
    }
    if (self.isLockMove) {
      return stopMove()
    }

    if (data.name === 'stop') {
      if (move[data.key]) {
        moveTicker[data.key].stop()
        move[data.key] = false
      }
      return
    }

    if (move[data.key]) return

    currentKey = data.key
    move[data.key] = true
    moveTicker[data.key].start()
  }

  self.command.position = data => {
    if (config.isMe) return false
    self.container.x = data.x * window.$point
    self.container.y = data.y * window.$point
    self.direct = data.direct
    self.buildWeaponPosition()
  }

  self.command.lockMove = data => {
    self.isSuperLockMove = true
    setTimeout(() => {
      self.isSuperLockMove = false
    }, data.effectTime)
  }

  self.command.text = data => {
    const style = data.style || {}
    const time = data.time || 1000
    if (self.text) {
      self.container.removeChild(self.text)
      self.text = null
    }
    self.text = new window.PIXI.Text(data.title, style)
    self.text.y = -self.ball.height / 2
    self.text.x = self.ball.width / 2
    self.container.addChild(self.text)
    setTimeout(() => {
      self.container.removeChild(self.text)
      self.text = null
    }, time)
  }

  self.command.hp = data => {
    let hp = data.hp

    // Reduce damage
    if (hp < 0 && s2.isRun) {
      hp = hp - Math.round((hp * s2.defPercent) / 100)
    }
    self.hp += hp
    self.command.text({
      title: data.title || hp,
      time: data.time,
      style: {
        fill: '0xFF0000',
        fontSize: data.isCrit ? window.$4_point : window.$2_point
      }
    })

    self.buildHp()

    if (self.hp <= 0) {
      window.$command({
        name: 'gameOver',
        id: config.id
      })
    }
  }

  self.buildWeaponPosition = () => {
    const position = window.$helper.positionWeaponByDirect(self.direct, self.ball)
    self.weapon.angle = position.angle
    self.weapon.x = position.x
    self.weapon.y = position.y
  }

  self.buildHp = () => {
    const hpSelector = document.querySelector(`[user-id="${config.id}"] .hp-bar-remain`)
    if (hpSelector) {
      hpSelector.style.width = (self.hp / self.hpTotal) * 100 + '%'
    }
  }

  // S1
  const s1 = {
    src: window.$helper.sprite(s1Texture, window.$15_point, window.$8_point),
    ticker: new window.PIXI.Ticker(),
    ticker2: new window.PIXI.Ticker(),
    sound: window.$helper.sound(`${namespace}s1.mp3`),
    isEnabled: true,
    atk: 110,
    speed: 5,
    speed2: window.$1_point * 1.5,
    range2: window.$30_point,
    delay2: 100,
    angle: 75
  }

  s1.ticker.add(() => {
    self.weapon.angle += s1.currentDirect[1] * s1.speed
    s1.currentRange += s1.speed

    if (s1.currentRange >= s1.angle) {
      self.isAtk = false
      self.isLockMove = false
      self.buildWeaponPosition()
      s1.ticker.stop()
    }
  })

  s1.ticker2.add(delta => {
    if (config.isMe && !s1.isHit) {
      for (let i in window.$players) {
        if (i === config.id) continue
        s1.isHit = window.$helper.isHit(s1.src, window.$players[i].ball.ball)

        if (config.isMe && s1.isHit) {
          window.$command({
            name: 'hp',
            hp: -s1.atk,
            id: i
          })
          break
        }
      }
    }

    const speed2 = s1.speed2 * delta
    s1.src[s1.currentDirect[0]] = s1.src[s1.currentDirect[0]] + s1.currentDirect[1] * speed2
    s1.currentRange2 += speed2

    if (s1.currentRange2 >= s1.range2) {
      window.$pixi.stage.removeChild(s1.src)
      s1.sound.stop()
      s1.isEnabled = true
      s1.ticker2.stop()
    }
  })

  s1.ctrl = () => {
    if (config.isMe) {
      if (!s1.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's1'
      })
      s1.isEnabled = false
      self.isAtk = true
      self.isLockMove = true
      window.$runSkill('s1')
    }

    s1.currentDirect = [...self.direct]
    s1.currentRange = 0
    s1.currentRange2 = 0
    s1.isHit = false
    const anchor = window.$helper.anchor(self.container, self.ball, s1.currentDirect, s1.src)
    s1.src.x = anchor.x
    s1.src.y = anchor.y
    s1.src.angle = window.$helper.angleByDirect(s1.currentDirect, s1.src)
    s1.ticker.start()

    setTimeout(() => {
      s1.sound.play()
      window.$pixi.stage.addChild(s1.src)
      s1.ticker2.start()
    }, s1.delay2)
  }

  self.command.s1 = self.ctrl.s1 = () => {
    s1.ctrl()
  }

  // S2
  const s2 = {
    src: window.$helper.sprite(s2Texture, window.$20_point, window.$10_point),
    ticker: new window.PIXI.Ticker(),
    ticker2: new window.PIXI.Ticker(),
    sound: window.$helper.sound(`${namespace}s2.mp3`),
    isEnabled: true,
    atk: 200,
    speed: 4,
    speed2: window.$1_point * 1.5,
    range2: window.$50_point,
    delay2: 500,
    angle: 90
  }

  s2.ticker.add(() => {
    self.weapon.angle += s2.currentDirect[1] * s2.speed
    s2.currentRange += s2.speed

    if (s2.currentRange >= s2.angle) {
      self.isAtk = false
      self.isLockMove = false
      self.buildWeaponPosition()
      s2.ticker.stop()
    }
  })

  s2.ticker2.add(delta => {
    if (config.isMe && !s2.isHit) {
      for (let i in window.$players) {
        if (i === config.id) continue
        s2.isHit = window.$helper.isHit(s2.src, window.$players[i].ball.ball)

        if (config.isMe && s2.isHit) {
          window.$command({
            name: 'hp',
            hp: -s2.atk,
            id: i
          })
          break
        }
      }
    }

    const speed2 = s2.speed2 * delta
    s2.src[s2.currentDirect[0]] = s2.src[s2.currentDirect[0]] + s2.currentDirect[1] * speed2
    s2.currentRange2 += speed2

    if (s2.currentRange2 >= s2.range2) {
      window.$pixi.stage.removeChild(s2.src)
      s2.sound.stop()
      s2.isEnabled = true
      s2.ticker2.stop()
    }
  })

  s2.ctrl = () => {
    if (config.isMe) {
      if (!s2.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's2'
      })
      s2.isEnabled = false
      self.isAtk = true
      self.isLockMove = true
      self.lockSkillSpam()
      window.$runSkill('s2')
    }

    s2.currentDirect = [...self.direct]
    s2.currentRange = 0
    s2.currentRange2 = 0
    s2.isHit = false
    const anchor = window.$helper.anchor(self.container, self.ball, s2.currentDirect, s2.src)
    s2.src.x = anchor.x
    s2.src.y = anchor.y
    s2.src.angle = window.$helper.angleByDirect(s2.currentDirect, s2.src)
    s2.ticker.start()

    setTimeout(() => {
      s2.sound.play()
      window.$pixi.stage.addChild(s2.src)
      s2.ticker2.start()
    }, s2.delay2)
  }

  self.command.s2 = self.ctrl.s2 = () => {
    s2.ctrl()
  }

  // S2
  const s3 = {
    isEnabled: true,
    sound: window.$helper.sound(`${namespace}s3.mp3`),
    isRun: false,
    delay: 3000
  }

  self.ctrl.s3 = () => {
    if (config.isMe) {
      if (!s3.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's3'
      })

      window.$runSkill('s3')
    }
    s3.sound.play()
    self.isSuperLockMove = false
    s3.isEnabled = false

    setTimeout(() => {
      s3.isEnabled = true
    }, s3.delay)
  }

  self.command.s3 = () => {
    self.ctrl.s3()
  }

  // S4
  const s4 = {
    src: window.$helper.sprite(s4Texture, window.$point, window.$point),
    ticker: new window.PIXI.Ticker(),
    isEnabled: true,
    atk: 300,
    speed: 0.1,
    max: 2.5,
    timeout: 1000,
    sound: window.$helper.sound(`${namespace}s4.mp3`)
  }

  s4.ticker.add(delta => {
    if (!s4.isHit) {
      for (let i in window.$players) {
        if (i === config.id) continue
        s4.isHit = window.$helper.isHit(s4.src, window.$players[i].ball.ball)
        if (config.isMe && s4.isHit) {
          window.$command({
            name: 'hp',
            hp: -s4.atk,
            id: i
          })
          break
        }
      }
    }
    const speed = s4.speed * delta
    s4.src.scale.x += speed
    s4.src.scale.y += speed
    s4.currentRange += speed
    s4.src.angle += speed

    if (s4.currentRange >= s4.max) {
      s4.ticker.stop()
      setTimeout(() => {
        self.container.removeChild(s4.src)
        self.isLockMove = false
      }, s4.timeout)
    }
  })

  s4.ctrl = () => {
    if (config.isMe) {
      if (!s4.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's4'
      })
      s4.isEnabled = false
      self.lockSkillSpam()
      window.$runSkill('s4')
      self.isLockMove = true
    }

    s4.sound.play()

    s4.src.x = 0
    s4.src.y = 0
    self.ball.anchor.set(0.5)
    self.container.addChild(s4.src)
    s4.currentRange = 0
    s4.isHit = false
    s4.ticker.start()
  }

  self.command.s4 = self.ctrl.s4 = () => {
    s4.ctrl()
  }

  self.lockSkillSpam = () => {
    self.isLockSkill = true
    setTimeout(() => {
      self.isLockSkill = false
    }, 300)
  }

  self.buildWeaponPosition()
  self.buildHp()
  window.$helper.showArrow(self)
}
