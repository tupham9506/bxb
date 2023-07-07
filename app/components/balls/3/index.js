// eslint-disable-next-line no-unused-vars
function Ball3(config = {}) {
  const self = this
  const namespace = 'components/balls/3/'

  // Ball info
  self.hp = 1000
  self.hpTotal = 1000
  self.speed = window.$point
  self.direct = config.direct
  self.isLockMove = false
  self.isLockSkill = false
  self.ctrl = {}
  self.command = {}

  // Ball container
  self.container = new window.PIXI.Container()
  window.$pixi.stage.addChild(self.container)
  self.container.x = config.x || 0
  self.container.y = config.y || 0

  const ballTexture = window.PIXI.Texture.from(namespace + 'ball.svg')
  const s1Texture = window.PIXI.Texture.from(namespace + 's1.svg')

  self.ball = new window.PIXI.Sprite(ballTexture)
  self.ball.width = window.$10_point
  self.ball.height = window.$10_point
  self.ball.anchor.set(0.5)

  self.container.addChild(self.ball)
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
    if (self.isLockMove || currentKey !== 'left') return
    if (self.container.x - window.$point - self.ball.width / 2 <= 0) return
    self.container.x -= delta * self.speed
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
    if (self.isLockMove || currentKey !== 'right') return
    if (self.container.x + window.$point + self.ball.width / 2 >= window.$pixi.screen.width) return
    self.container.x += delta * self.speed
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
    if (self.isLockMove || currentKey !== 'up') return
    if (self.container.y - window.$point - self.ball.height / 2 <= 0) return
    self.container.y -= delta * self.speed
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
    if (self.isLockMove || currentKey !== 'down') return
    if (self.container.y + window.$point + self.ball.height / 2 >= window.$pixi.screen.height) return
    self.container.y += delta * self.speed
    self.direct = ['y', +1]
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

  self.ctrl.move = data => {
    if (self.isLockMove) {
      for (let i in move) {
        if (move[i]) {
          moveTicker[i].stop()
          move[i] = false
        }
      }
      return false
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
    self.hp += data.hp
    self.command.text({
      title: data.hp,
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

  self.buildHp = () => {
    const hpSelector = document.querySelector(`[user-id="${config.id}"] .hp-bar-remain`)
    if (hpSelector) {
      hpSelector.style.width = (self.hp / self.hpTotal) * 100 + '%'
    }
  }

  // S1
  const s1 = {
    src: window.$helper.sprite(s1Texture, window.$10_point, window.$2_point),
    ticker: new window.PIXI.Ticker(),
    isEnabled: true,
    atk: 50,
    speed: 1.2 * window.$1_point,
    timeout: 3000,
    timeoutId: null,
    sound: window.$helper.sound(`${namespace}s1.mp3`)
  }

  s1.ticker.add(delta => {
    if (!s1.isHit) {
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

    const speed = s1.speed * delta
    s1.src[s1.currentDirect[0]] = s1.src[s1.currentDirect[0]] + s1.currentDirect[1] * speed
    s1.currentRange += speed

    if (s1.isHit || s1.currentRange >= window.$30_point) {
      if (s1.isHit) {
        s1.timeoutId = setTimeout(() => {
          s1.timeoutId = null
        }, s1.timeout)
      }
      s1.sound.stop()
      if (s1.currentRange >= window.$30_point) {
        s1.isEnabled = true
        s1.ticker.stop()
      }
      window.$pixi.stage.removeChild(s1.src)
      if (!s1.isHit) s1.timeoutId = null
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
    }
    clearTimeout(s1.timeoutId)
    s1.timeoutId = null
    s1.sound.play()

    s1.currentDirect = [...self.direct]
    const anchor = window.$helper.anchor(self.container, self.ball, s1.currentDirect, s1.src)
    s1.src.x = anchor.x
    s1.src.y = anchor.y
    s1.src.angle = window.$helper.angleByDirect(s1.currentDirect)
    window.$pixi.stage.addChild(s1.src)

    s1.currentRange = 0
    s1.isHit = false
    s1.ticker.start()
  }

  self.ctrl.s1 = self.command.s1 = () => {
    s1.ctrl()
  }

  // S2
  const s2 = {
    isEnabled: true,
    atk: 100,
    effectTime: 1000,
    sound: window.$helper.sound(`${namespace}s2.mp3`)
  }

  s2.ctrl = () => {
    if (config.isMe) {
      if (!s2.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's2'
      })
    }

    if (!s1.timeoutId) return

    for (let i in window.$players) {
      if (i !== config.id) {
        s1.timeoutId = null
        self.oldX = self.container.x
        self.oldY = self.container.y
        self.container.x = window.$players[i].ball.container.x
        self.container.y = window.$players[i].ball.container.y
        window.$command({
          name: 'hp',
          hp: -s1.atk,
          id: i
        })
        break
      }
    }
  }

  self.ctrl.s2 = () => {
    s2.ctrl()
  }

  self.command.s2 = () => {
    if (!config.isMe) {
      s2.ctrl()
    }
  }

  // S3
  const s3 = {
    isEnabled: true,
    sound: window.$helper.sound(`${namespace}s3-end.mp3`)
  }

  s3.ctrl = () => {
    if (!self.oldX) return false

    if (config.isMe) {
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's3'
      })
    }

    self.container.x = self.oldX
    self.container.y = self.oldY
    self.oldX = null
    self.oldY = null
  }

  self.ctrl.s3 = self.command.s3 = () => {
    s3.ctrl()
  }

  // S4
  const s4 = {
    ticker: new window.PIXI.Ticker(),
    isEnabled: true,
    atk: 200,
    speed: window.$5_point,
    sound: window.$helper.sound(`${namespace}s4.mp3`)
  }

  s4.ticker.add(delta => {
    if (!s4.isHit) {
      for (let i in window.$players) {
        if (i === config.id) continue
        s4.isHit = window.$helper.isHit(self.ball, window.$players[i].ball.ball)

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

    const outArea = window.$helper.isOutArea(self.ball, self.direct)
    if (s4.isHit || outArea) {
      if (s4.isHit) {
        s1.timeoutId = setTimeout(() => {
          s1.timeoutId = null
        }, s1.timeout)
      }
      self.isLockMove = false

      if (outArea) {
        s4.ticker.stop()
        self.container[outArea[0]] = outArea[1]

        return
      }
    }

    const speed = s4.speed * delta
    self.container[self.direct[0]] = self.container[self.direct[0]] + self.direct[1] * speed
  })

  s4.ctrl = () => {
    if (config.isMe) {
      if (!s4.isEnabled) return
      if (self.isLockSkill) return
      self.isLockMove = true

      window.$command({
        id: window.id,
        name: 's4'
      })
      s4.isEnabled = false
    }

    s4.sound.play()
    s4.isHit = false
    s4.ticker.start()
  }

  self.command.s4 = self.ctrl.s4 = () => {
    s4.ctrl()
  }

  self.buildHp()
}
