// eslint-disable-next-line no-unused-vars
function Ball2(config = {}) {
  const namespace = 'components/balls/2/'
  const self = this

  // Ball info
  self.hp = 1200
  self.hpTotal = 1200
  self.speed = window.$point
  self.direct = config.direct
  self.isLockMove = false
  self.isLockSkill = false
  self.ctrl = {}
  self.command = {}
  self.isAtk = false

  // Ball container
  self.container = new window.PIXI.Container()
  window.$pixi.stage.addChild(self.container)
  self.container.x = config.x || 0
  self.container.y = config.y || 0

  const ballTexture = window.PIXI.Texture.from(namespace + 'ball.svg')
  const ballS2Texture = window.PIXI.Texture.from(namespace + 'ball-s2.svg')
  const ballS4Texture = window.PIXI.Texture.from(namespace + 'ball-s4.svg')

  self.ball = new window.PIXI.Sprite(ballTexture)
  self.ball.width = window.$10_point
  self.ball.height = window.$10_point
  self.ball.anchor.set(0.5)

  const weaponTexture = window.PIXI.Texture.from(namespace + 'weapon.svg')
  const weaponS4Texture = window.PIXI.Texture.from(namespace + 'weapon-s4.svg')
  self.weapon = new window.PIXI.Sprite(weaponTexture)
  self.weapon.width = window.$5_point
  self.weapon.height = window.$15_point
  self.weapon.x = +self.ball.width / 2
  self.weapon.anchor.set(0.5, 0)

  self.container.addChild(self.ball)
  self.container.addChild(self.weapon)
  self.text = null
  let currentMove = null
  let currentMoveTicker = new window.PIXI.Ticker()
  let stopMoveTimeout = null

  // Control define
  self.ctrl.left = delta => {
    if (self.container.x - window.$point - self.ball.width / 2 <= 0) return
    const speed = stopMoveTimeout ? self.speed / 2 : self.speed
    self.container.x -= delta * speed
    self.direct = ['x', -1]
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
  }

  self.ctrl.right = delta => {
    if (self.container.x + window.$point + self.ball.width / 2 >= window.$pixi.screen.width) return
    const speed = stopMoveTimeout ? self.speed / 2 : self.speed
    self.container.x += delta * speed
    self.direct = ['x', +1]
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
  }

  self.ctrl.up = delta => {
    if (self.container.y - window.$point - self.ball.height / 2 <= 0) return
    const speed = stopMoveTimeout ? self.speed / 2 : self.speed
    self.container.y -= delta * speed
    self.direct = ['y', -1]
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
  }

  self.ctrl.down = delta => {
    if (self.container.y + window.$point + self.ball.height / 2 >= window.$pixi.screen.height) return
    const speed = stopMoveTimeout ? self.speed / 2 : self.speed
    self.container.y += delta * speed
    self.direct = ['y', +1]
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
  }

  self.ctrl.move = data => {
    if (stopMoveTimeout) {
      clearTimeout(stopMoveTimeout)
      stopMoveTimeout = null
    }

    if (self.isLockMove) {
      currentMoveTicker.remove(self.ctrl[currentMove])
      currentMoveTicker.stop()
      currentMove = null
      return
    }

    if (!self.isAtk) {
      self.buildWeaponPosition()
    }
    if (data.key !== 'stop' && currentMove && data.key !== currentMove) {
      currentMoveTicker.stop()
      currentMoveTicker.remove(self.ctrl[currentMove])
    }
    if (data.key === 'stop') {
      stopMoveTimeout = setTimeout(() => {
        currentMoveTicker.stop()
        currentMoveTicker.remove(self.ctrl[currentMove])
        currentMove = null
      }, 150)

      return
    }
    if (currentMove === data.key) return

    currentMove = data.key
    currentMoveTicker.add(self.ctrl[data.key])
    currentMoveTicker.start()
  }

  self.command.position = data => {
    if (config.isMe) return false
    self.container.x = data.x * window.$point
    self.container.y = data.y * window.$point
    self.direct = data.direct
    self.buildWeaponPosition()
  }

  self.command.lockMove = data => {
    self.isLockMove = true
    setTimeout(() => {
      self.isLockMove = false
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
      // hpSelector.innerHTML = self.hp
    }
  }

  // S1
  const s1 = {
    ticker: new window.PIXI.Ticker(),
    isEnabled: true,
    atk: 100,
    speed: 7,
    angle: 75,
    endTime: 500
  }

  s1.ticker.add(delta => {
    if (config.isMe && !s1.isHit) {
      for (let i in window.$players) {
        if (i === config.id) continue
        s1.isHit = window.$helper.isHit(self.weapon, window.$players[i].ball.ball)

        if (config.isMe && s1.isHit) {
          window.$command({
            name: 'hp',
            hp: -(s1.atk + s1.crit),
            isCrit: s1.isCrit,
            id: i
          })
          break
        }
      }
    }

    const speed = s1.speed * delta + s4.currentRange / 10
    self.weapon.angle += s1.currenDirect[1] * speed
    s4.currentRange += speed

    if (s4.currentRange >= s1.angle) {
      setTimeout(() => {
        s1.isEnabled = true
        self.isAtk = false
        self.buildWeaponPosition()
        if (s1.isCrit && !s4.isRun) {
          self.weapon.texture = weaponTexture
        }
      }, s1.endTime)
      s1.ticker.stop()
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
    }

    s4.currentRange = 0
    s1.isHit = false
    s1.crit = window.$helper.getRandomFrom(s3.critMin, s3.critMax)
    s1.isCrit = s1.crit > s3.critMax / 2
    s1.currenDirect = [...self.direct]
    s1.ticker.start()
  }

  self.command.s1 = self.ctrl.s1 = () => {
    s1.ctrl()
  }

  // S2
  const s2 = {
    isEnabled: true,
    defPercent: 80,
    time: 1000,
    isRun: false,
    delay: 2000
  }

  self.ctrl.s2 = () => {
    if (config.isMe) {
      if (!s2.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's2'
      })
      if (currentMoveTicker) currentMoveTicker.stop()
      self.isLockMove = true
    }
    s2.isRun = true
    s2.isEnabled = false

    self.ball.texture = ballS2Texture
    setTimeout(() => {
      self.ball.texture = ballTexture
      self.isLockMove = false
      s2.isRun = false
    }, s2.time)

    setTimeout(() => {
      s2.isEnabled = true
    }, s2.delay)
  }

  self.command.s2 = () => {
    self.ctrl.s2()
  }

  // S3: passive
  const s3 = {
    critMin: 0,
    critMax: 50
  }

  self.ctrl.s3 = () => {}

  self.command.s3 = () => {
    self.ctrl.s3()
  }

  // S4
  const s4 = {
    isEnabled: true,
    isRun: false,
    speedUp: window.$2_point,
    speedUpEnd: 1.2 * window.$point,
    speedUpTime: 1000,
    time: 9000,
    weaponWidth: window.$6_point,
    weaponHeight: window.$20_point,
    s1Atk: 130
  }

  self.ctrl.s4 = () => {
    if (config.isMe) {
      if (!s4.isEnabled) return
      if (self.isLockSkill) return
      window.$command({
        id: window.id,
        name: 's4'
      })
      s4.isEnabled = false
      s2.isEnabled = false
    }
    s4.isRun = true
    const weaponWidthOrg = self.weapon.width
    const weaponHeightOrg = self.weapon.height
    const s1AtkOld = s1.atk

    self.weapon.texture = weaponS4Texture
    self.ball.texture = ballS4Texture
    self.weapon.width = s4.weaponWidth
    self.weapon.height = s4.weaponHeight
    s1.atk = s4.s1Atk

    // Speed up
    const speedOrg = self.speed
    self.speed = s4.speedUp
    setTimeout(() => {
      self.speed = s4.speedUpEnd
    }, s4.speedUpTime)

    setTimeout(() => {
      s4.isRun = false
      self.weapon.texture = weaponTexture
      self.ball.texture = ballTexture
      self.weapon.width = weaponWidthOrg
      self.weapon.height = weaponHeightOrg
      self.speed = speedOrg
      s1.atk = s1AtkOld
      s2.isEnabled = true
    }, s4.time)
  }

  self.command.s4 = () => {
    self.ctrl.s4()
  }

  self.buildWeaponPosition()
  self.buildHp()
}
