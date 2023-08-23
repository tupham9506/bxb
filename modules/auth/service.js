const User = require('./../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

module.exports = {
  async login(req) {
    if (!req.body.userName || !req.body.password) {
      return {
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin.'
      }
    }
    let user = await User.findOne({
      userName: req.body.userName
    })

    if (!user) {
      const hash = bcrypt.hashSync(req.body.password, 10)
      const id = new mongoose.mongo.ObjectId()
      user = await User.create({
        _id: id,
        id,
        userName: req.body.userName,
        password: hash
      })
    } else {
      const isAuth = await bcrypt.compare(req.body.password, user.password || 'jasjdaksjd')
      if (!isAuth) {
        return {
          success: false,
          message: 'Sai tên đăng nhập hoặc mật khẩu.'
        }
      }
    }

    const token = generateToken({ id: user.id })
    return {
      success: true,
      token
    }
  }
}

function generateToken(input) {
  return jwt.sign(input, process.env.JWT_SECRET, {
    expiresIn: '100d'
  })
}
