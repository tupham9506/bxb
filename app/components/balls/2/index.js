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
  let currentMoveId = null

  // Control define
  self.ctrl.left = () => {
    if (self.container.x <= 0) return
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
    if (self.container.x + self.ball.width >= window.$pixi.screen.width) return
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
    if (self.container.y <= 0) return
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
    if (self.container.y + self.ball.height >= window.$pixi.screen.height) return
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

    if (!self.isAtk) {
      self.buildWeaponPosition()
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
    isEnabled: true,
    atk: 100,
    speed: 7,
    angle: 75,
    endTime: 500
  }

  self.ctrl.s1 = () => {
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

    let count = 0
    let isHit = false
    const crit = window.$helper.getRandomFrom(s3.critMin, s3.critMax)
    const isCrit = crit > s3.critMax / 2

    const currenDirect = [...self.direct]

    requestAnimationFrame(function start() {
      if (config.isMe && !isHit) {
        for (let i in window.$players) {
          if (i === config.id) continue
          isHit = window.$helper.isHit(self.weapon, window.$players[i].ball.ball)

          if (config.isMe && isHit) {
            window.$command({
              name: 'hp',
              hp: -(s1.atk + crit),
              isCrit: isCrit,
              id: i
            })
            break
          }
        }
      }

      self.weapon.angle += currenDirect[1] * s1.speed
      count += s1.speed

      if (count >= s1.angle) {
        setTimeout(() => {
          s1.isEnabled = true
          self.isAtk = false
          self.buildWeaponPosition()
          if (isCrit && !s4.isRun) {
            self.weapon.texture = weaponTexture
          }
        }, s1.endTime)

        return true
      }

      requestAnimationFrame(start)
    })
  }

  self.command.s1 = () => {
    self.ctrl.s1()
  }

  // S2
  const s2 = {
    isEnabled: true,
    defPercent: 80,
    time: 2000,
    isRun: false
  }

  self.ctrl.s2 = () => {
    if (config.isMe) {
      if (!s2.isEnabled) return
      if (self.isLockSkill) return

      window.$command({
        id: window.id,
        name: 's2'
      })
      self.isLockMove = true
    }
    s2.isRun = true
    s2.isEnabled = false

    self.ball.texture = ballS2Texture
    setTimeout(() => {
      self.ball.texture = ballTexture
      self.isLockMove = false
      s2.isEnabled = true
      s2.isRun = false
    }, s2.time)
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
    document.querySelector('.ultimate-skill').innerHTML = ''
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
  self.buildSkill()
}
