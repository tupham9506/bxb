// eslint-disable-next-line no-unused-vars
function Ball1(config = {}) {
  const self = this
  const namespace = 'components/balls/1/'

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
  const s2Texture = window.PIXI.Texture.from(namespace + 's2.svg')
  const s3Texture = window.PIXI.Texture.from(namespace + 's3.svg')
  const s3EndTexture = window.PIXI.Texture.from(namespace + 's3-end.svg')
  const s4Texture = window.PIXI.Texture.from(namespace + 's4.svg')

  self.ball = new window.PIXI.Sprite(ballTexture)
  self.ball.width = window.$10_point
  self.ball.height = window.$10_point
  self.ball.anchor.set(0.5)

  self.container.addChild(self.ball)
  self.text = null
  let currentMove = null
  let currentMoveId = new window.PIXI.Ticker()
  let timeout = null

  // Control define
  self.ctrl.left = delta => {
    if (self.container.x - window.$point - self.ball.width / 2 <= 0) return
    if (self.isLockMove) return
    const speed = timeout ? self.speed / 2 : self.speed
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
    const speed = timeout ? self.speed / 2 : self.speed
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
    const speed = timeout ? self.speed / 2 : self.speed
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
    const speed = timeout ? self.speed / 2 : self.speed
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
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    if (self.isLockMove) {
      currentMoveId.remove(self.ctrl[currentMove])
      currentMove = null
      return
    }

    if (data.key !== 'stop' && currentMove && data.key !== currentMove) {
      currentMoveId.stop()
      currentMoveId.remove(self.ctrl[currentMove])
    }

    if (data.key === 'stop') {
      timeout = setTimeout(() => {
        currentMoveId.stop()
        currentMoveId.remove(self.ctrl[currentMove])
        currentMove = null
      }, 150)

      return
    }
    if (currentMove === data.key) return

    currentMove = data.key
    currentMoveId.add(self.ctrl[data.key])
    console.log(currentMoveId)
    currentMoveId.start()
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
      const size = config.isMe ? 'height' : 'width'
      hpSelector.style[size] = (self.hp / self.hpTotal) * 100 + '%'
      if (!config.isMe) {
        hpSelector.innerHTML = self.hp
      }
    }
  }

  self.buildSkill = () => {
    if (!config.isMe) return false
    document.querySelector('.ultimate .skill-1').innerHTML = `<img src="${namespace}/s1-icon.svg">`
    document.querySelector('.ultimate .skill-2').innerHTML = `<img src="${namespace}/s2-icon.svg">`
    document.querySelector('.ultimate .skill-3').innerHTML = `<img src="${namespace}/s3-icon.svg">`
    document.querySelector('.ultimate .ultimate-skill').innerHTML = `<img src="${namespace}/s4-icon.svg">`
  }

  // S1
  const s1 = {
    src: window.$helper.sprite(s1Texture, window.$5_point, window.$10_point),
    ticker: new window.PIXI.Ticker(),
    isEnabled: true,
    atk: 100,
    speed: window.$1_point
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
    s1.src[s1.direct[0]] = s1.src[s1.direct[0]] + s1.direct[1] * speed
    s1.currentRange += speed

    if (s1.isHit || s1.currentRange >= window.$50_point) {
      window.$pixi.stage.removeChild(s1.src)
      s1.ticker.stop()
      if (s1.currentRange >= window.$50_point) s1.isEnabled = true
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

    s1.direct = [...self.direct]
    const anchor = window.$helper.anchor(self.container, self.ball, s1.direct, s1.src)
    s1.src.x = anchor.x
    s1.src.y = anchor.y
    s1.src.angle = window.$helper.angleByDirect(s1.direct)
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
    src: window.$helper.sprite(s2Texture, window.$10_point, window.$10_point),
    ticker: new window.PIXI.Ticker(),
    isEnabled: true,
    atk: 50,
    speed: window.$1_point,
    range: window.$100_point,
    effectTime: 2000
  }

  s2.ticker.add(delta => {
    if (!s2.isHit) {
      for (let i in window.$players) {
        if (i === config.id) continue
        s2.isHit = window.$helper.isHit(s2.src, window.$players[i].ball.ball)

        if (config.isMe && s2.isHit) {
          window.$command({
            name: 'lockMove',
            effectTime: s2.effectTime,
            id: i
          })
          window.$command({
            name: 'hp',
            hp: -s2.atk,
            id: i,
            title: 'Bị Đóng Băng',
            time: s2.effectTime
          })
          break
        }
      }
    }

    const speed = s2.speed * delta
    s2.src[s2.currenDirect[0]] = s2.src[s2.currenDirect[0]] + s2.currenDirect[1] * speed

    s2.currentRange += speed
    if (s2.isHit || s2.currentRange >= s2.range) {
      window.$pixi.stage.removeChild(s2.src)
      if (s2.currentRange >= window.$50_point) s2.isEnabled = true
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
    }

    s2.currenDirect = [...self.direct]
    const anchor = window.$helper.anchor(self.container, self.ball, s2.currenDirect, s2.src)
    s2.src.x = anchor.x
    s2.src.y = anchor.y
    s2.src.angle = window.$helper.angleByDirect(s2.currenDirect)
    window.$pixi.stage.addChild(s2.src)

    s2.currentRange = 0
    s2.isHit = false
    s2.ticker.start()
  }

  self.ctrl.s2 = self.command.s2 = () => {
    s2.ctrl()
  }

  // S3
  const s3 = {
    src: window.$helper.sprite(s3Texture, window.$10_point, window.$10_point),
    endSrc: window.$helper.sprite(s3EndTexture, window.$10_point, window.$10_point),
    ticker: new window.PIXI.Ticker(),
    tickerEnd: new window.PIXI.Ticker(),
    isEnabled: true,
    atk: 150,
    speed: window.$1_point,
    range: window.$40_point,
    endSize: window.$10_point,
    endTime: 1
  }

  s3.ticker.add(delta => {
    const speed = s3.speed * delta
    s3.src[s3.currenDirect[0]] = s3.src[s3.currenDirect[0]] + s3.currenDirect[1] * speed
    s3.src.rotation += 0.1

    s3.currentRange += speed
    if (s3.currentRange >= s3.range) {
      window.$pixi.stage.removeChild(s3.src)
      s3.endSrc.x = s3.src.x
      s3.endSrc.y = s3.src.y
      s3.ticker.stop()
      s3.tickerEnd.start()
    }
  })

  s3.tickerEnd.add(delta => {
    window.$pixi.stage.addChild(s3.endSrc)
    if (!s3.isHit) {
      for (let i in window.$players) {
        if (i === config.id) continue
        s3.isHit = window.$helper.isHit(s3.endSrc, window.$players[i].ball.ball)
        if (config.isMe && s3.isHit) {
          window.$command({
            name: 'hp',
            hp: -s3.atk,
            id: i
          })
          break
        }
      }
    }

    s3.endSrc.width += 0.2 * window.$1_point * delta
    s3.endSrc.height += 0.2 * window.$1_point * delta

    if (s3.endSrc.width >= s3.endSize) {
      setTimeout(() => {
        window.$pixi.stage.removeChild(s3.endSrc)
        s3.endSrc.width = window.$10_point
        s3.endSrc.height = window.$10_point
        s3.isEnabled = true
        s3.tickerEnd.stop()
      }, s3.endTime * 1000)
    }
  })

  s3.ctrl = () => {
    if (config.isMe) {
      if (!s3.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's3'
      })
      s3.isEnabled = false
    }

    s3.currenDirect = [...self.direct]
    const anchor = window.$helper.anchor(self.container, self.ball, s3.currenDirect, s3.src)
    s3.src.x = anchor.x
    s3.src.y = anchor.y
    s3.src.angle = window.$helper.angleByDirect(s3.currenDirect)
    window.$pixi.stage.addChild(s3.src)

    s3.currentRange = 0
    s3.isHit = false
    s3.ticker.start()
  }

  self.ctrl.s3 = self.command.s3 = () => {
    s3.ctrl()
  }

  // S4
  const s4 = {
    src: new window.PIXI.Sprite(s4Texture),
    isEnabled: true,
    atk: 400,
    speed: window.$2_point
  }

  s4.src.width = window.$40_point
  s4.src.height = window.$40_point
  s4.src.anchor.set(0.5)

  self.ctrl.s4 = () => {
    if (config.isMe) {
      if (!s4.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's4'
      })
      s4.isEnabled = false
    }
    document.querySelector('.ultimate-skill').innerHTML = ''

    const currenDirect = [...self.direct]
    const anchor = window.$helper.anchor(self.container, self.ball, currenDirect, s4.src)
    s4.src.x = anchor.x
    s4.src.y = anchor.y
    s4.src.angle = window.$helper.angleByDirect(currenDirect)
    window.$pixi.stage.addChild(s4.src)
    window.$pixi.renderer.backgroundColor = '#3f3f3f'
    let count = 0
    let isHit = false

    requestAnimationFrame(function start() {
      if (!isHit) {
        for (let i in window.$players) {
          if (i === config.id) continue
          isHit = window.$helper.isHit(s4.src, window.$players[i].ball.ball)
          if (config.isMe && isHit) {
            window.$command({
              name: 'hp',
              hp: -s4.atk,
              id: i
            })
            break
          }
        }
      }

      s4.src[currenDirect[0]] = s4.src[currenDirect[0]] + currenDirect[1] * s4.speed
      count += s4.speed
      if (isHit || count >= 2 * window.$100_point) {
        window.$pixi.stage.removeChild(s4.src)
        if (count >= window.$100_point) {
          s4.isEnabled = true
          window.$pixi.renderer.backgroundColor = '#FFFFFF'
          return true
        }
      }

      requestAnimationFrame(start)
    })
  }

  self.command.s4 = () => {
    self.ctrl.s4()
  }

  self.buildHp()
  self.buildSkill()
}
