const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const bodyParser = require('body-parser')

global.io = new Server(server)

app.use(require('cookie-parser')())

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

require('dotenv').config()

app.use(express.static('app'))

app.use(express.static(__dirname + '/app/pages', { extensions: ['html'] }))

const init = async () => {
  await require('./config/database')()
  global.io.use(require('./middlewares/socketAuth'))
  // Fetch modules
  require('./modules/home')(app)
  require('./modules/version')(app)
  require('./modules/story')(app)
  require('./modules/room')(app)
  require('./modules/select')(app)
  require('./modules/game')(app)
}

init()

server.listen(process.env.PORT)
