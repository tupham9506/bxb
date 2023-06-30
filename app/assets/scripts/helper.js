window.$helper = {
  angleByDirect: direct => {
    if (direct[0] === 'x') {
      if (direct[1] === 1) return 90
      return -90
    }

    if (direct[1] === -1) return 0
    return 180
  },
  positionWeaponByDirect: (direct, element) => {
    if (direct[0] === 'x') {
      if (direct[1] === 1)
        return {
          x: element.width / 2,
          y: element.y,
          angle: -135
        }
      return {
        x: -element.width / 2,
        y: element.y,
        angle: 135
      }
    }

    if (direct[1] === -1)
      return {
        x: element.x,
        y: -element.height / 2,
        angle: -135
      }
    return {
      x: element.x,
      y: element.height / 2,
      angle: -45
    }
  },
  anchor: (position, size, direct, element) => {
    if (direct[0] === 'x') {
      if (direct[1] === 1)
        return {
          x: position.x + size.width / 2 + element.width / 2,
          y: position.y
        }

      return {
        x: position.x - size.width / 2 - element.width / 2,
        y: position.y
      }
    }

    if (direct[1] === 1)
      return {
        x: position.x,
        y: position.y + size.height / 2 + element.height / 2
      }

    return {
      x: position.x,
      y: position.y - size.width / 2 - element.height / 2
    }
  },
  isHit: (element1, element2) => {
    const element1Bound = element1.getBounds()
    const element2Bound = element2.getBounds()

    return window.Intersects.boxBox(
      element1Bound.x,
      element1Bound.y,
      element1Bound.width,
      element1Bound.height,
      element2Bound.x,
      element2Bound.y,
      element2Bound.width,
      element2Bound.height
    )
  },
  setCookie: (name, value) => {
    document.cookie = name + '=' + (value || '') + '; path=/'
  },
  getCookie: name => {
    var nameEQ = name + '='
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) == ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },
  getRandomFrom: (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
  },
  sprite: (texture, width, height, x, y, anchor) => {
    const sprite = new window.PIXI.Sprite(texture)
    sprite.width = width
    sprite.height = height
    if (x) sprite.x = x
    if (y) sprite.y = y
    anchor = anchor || 0.5
    sprite.anchor.set(anchor)

    return sprite
  },
  sound: url => {
    return window.PIXI.sound.Sound.from({
      url: url,
      preload: true
    })
  }
}
