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
  let currentMoveId = null

  // Control define
  self.ctrl.left = () => {
    if (self.container.x - window.$point - self.ball.width / 2 <= 0) return
    if (self.isLockMove) return
    self.container.x -= self.speed
    self.direct = ['x', -1]
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
    currentMoveId = requestAnimationFrame(self.ctrl.left)
  }

  self.ctrl.right = () => {
    if (self.container.x + window.$point + self.ball.width / 2 >= window.$pixi.screen.width) return
    self.container.x += self.speed
    self.direct = ['x', +1]
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
    currentMoveId = requestAnimationFrame(self.ctrl.right)
  }

  self.ctrl.up = () => {
    if (self.container.y - window.$point - self.ball.height / 2 <= 0) return
    self.container.y -= self.speed
    self.direct = ['y', -1]
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
    currentMoveId = requestAnimationFrame(self.ctrl.up)
  }

  self.ctrl.down = () => {
    if (self.container.y + window.$point + self.ball.height / 2 >= window.$pixi.screen.height) return
    self.container.y += self.speed
    self.direct = ['y', +1]
    window.$command({
      id: config.id,
      name: 'position',
      x: self.container.x / window.$point,
      y: self.container.y / window.$point,
      direct: self.direct
    })
    currentMoveId = requestAnimationFrame(self.ctrl.down)
  }

  self.ctrl.move = data => {
    if (self.isLockMove) {
      currentMove = null
      cancelAnimationFrame(currentMoveId)
      return
    }

    if (currentMove && data.key !== currentMove) {
      cancelAnimationFrame(currentMoveId)
    }
    if (data.key === 'stop') {
      currentMove = null
      cancelAnimationFrame(currentMoveId)
      return
    }
    if (currentMove === data.key) return

    currentMove = data.key
    currentMoveId = requestAnimationFrame(self.ctrl[data.key])
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
    src: new window.PIXI.Sprite(s1Texture),
    isEnabled: true,
    atk: 100,
    speed: window.$1_point
  }

  s1.src.width = window.$5_point
  s1.src.height = window.$10_point
  s1.src.anchor.set(0.5)

  self.ctrl.s1 = () => {
    if (config.isMe) {
      if (!s1.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's1'
      })
      s1.isEnabled = false
    }

    const currenDirect = [...self.direct]
    const anchor = window.$helper.anchor(self.container, self.ball, currenDirect, s1.src)
    s1.src.x = anchor.x
    s1.src.y = anchor.y
    s1.src.angle = window.$helper.angleByDirect(currenDirect)
    window.$pixi.stage.addChild(s1.src)

    let count = 0
    var isHit = false

    requestAnimationFrame(function start() {
      if (!isHit) {
        for (let i in window.$players) {
          if (i === config.id) continue
          isHit = window.$helper.isHit(s1.src, window.$players[i].ball.ball)

          if (config.isMe && isHit) {
            window.$command({
              name: 'hp',
              hp: -s1.atk,
              id: i
            })
            break
          }
        }
      }

      s1.src[currenDirect[0]] = s1.src[currenDirect[0]] + currenDirect[1] * s1.speed
      count += s1.speed
      if (isHit || count >= window.$50_point) {
        window.$pixi.stage.removeChild(s1.src)
        if (count >= window.$50_point) {
          s1.isEnabled = true
          return true
        }
      }

      requestAnimationFrame(start)
    })
  }

  self.command.s1 = () => {
    self.ctrl.s1()
  }

  // S2
  const s2 = {
    src: new window.PIXI.Sprite(s2Texture),
    isEnabled: true,
    atk: 50,
    speed: window.$1_point,
    range: window.$100_point,
    effectTime: 2000
  }

  s2.src.width = window.$10_point
  s2.src.height = window.$10_point
  s2.src.anchor.set(0.5)

  self.ctrl.s2 = () => {
    if (config.isMe) {
      if (!s2.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's2'
      })
      s2.isEnabled = false
    }

    const currenDirect = [...self.direct]
    const anchor = window.$helper.anchor(self.container, self.ball, currenDirect, s2.src)
    s2.src.x = anchor.x
    s2.src.y = anchor.y
    s2.src.angle = window.$helper.angleByDirect(currenDirect)
    window.$pixi.stage.addChild(s2.src)

    let count = 0
    let isHit = false

    requestAnimationFrame(function start() {
      if (!isHit) {
        for (let i in window.$players) {
          if (i === config.id) continue
          isHit = window.$helper.isHit(s2.src, window.$players[i].ball.ball)

          if (config.isMe && isHit) {
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

      s2.src[currenDirect[0]] = s2.src[currenDirect[0]] + currenDirect[1] * s2.speed

      count += s2.speed
      if (isHit || count >= s2.range) {
        window.$pixi.stage.removeChild(s2.src)
        if (count >= window.$50_point) {
          s2.isEnabled = true
          return true
        }
      }

      requestAnimationFrame(start)
    })
  }

  self.command.s2 = () => {
    self.ctrl.s2()
  }

  // S3
  const s3 = {
    src: new window.PIXI.Sprite(s3Texture),
    isEnabled: true,
    atk: 150,
    speed: window.$1_point,
    range: window.$40_point,
    endSrc: new window.PIXI.Sprite(s3EndTexture),
    endSize: window.$20_point,
    endTime: 1
  }

  s3.src.width = window.$10_point
  s3.src.height = window.$10_point
  s3.src.anchor.set(0.5)
  s3.endSrc.width = window.$10_point
  s3.endSrc.height = window.$10_point
  s3.endSrc.anchor.set(0.5)

  self.ctrl.s3 = () => {
    if (config.isMe) {
      if (!s3.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's3'
      })
      s3.isEnabled = false
    }

    const currenDirect = [...self.direct]
    const anchor = window.$helper.anchor(self.container, self.ball, currenDirect, s3.src)
    s3.src.x = anchor.x
    s3.src.y = anchor.y
    s3.src.angle = window.$helper.angleByDirect(currenDirect)
    window.$pixi.stage.addChild(s3.src)

    let count = 0
    let isHit = false

    requestAnimationFrame(function start() {
      s3.src[currenDirect[0]] = s3.src[currenDirect[0]] + currenDirect[1] * s3.speed
      s3.src.rotation += 0.1

      count += s3.speed
      if (count >= s3.range) {
        window.$pixi.stage.removeChild(s3.src)
        s3.endSrc.x = s3.src.x
        s3.endSrc.y = s3.src.y
        requestAnimationFrame(end)
        return true
      }

      requestAnimationFrame(start)
    })

    function end() {
      window.$pixi.stage.addChild(s3.endSrc)
      if (!isHit) {
        for (let i in window.$players) {
          if (i === config.id) continue
          isHit = window.$helper.isHit(s3.endSrc, window.$players[i].ball.ball)
          if (config.isMe && isHit) {
            window.$command({
              name: 'hp',
              hp: -s3.atk,
              id: i
            })
            break
          }
        }
      }

      s3.endSrc.width += 0.5 * window.$1_point
      s3.endSrc.height += 0.5 * window.$1_point

      if (s3.endSrc.width >= s3.endSize) {
        setTimeout(() => {
          window.$pixi.stage.removeChild(s3.endSrc)
          s3.endSrc.width = window.$10_point
          s3.endSrc.height = window.$10_point
          s3.isEnabled = true
        }, s3.endTime * 1000)
        return true
      }
      requestAnimationFrame(end)
    }
  }

  self.command.s3 = () => {
    self.ctrl.s3()
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
