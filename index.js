const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
global.io = new Server(server);
const  { v4: uuidv4 } = require('uuid');
var path = require("path");

app.use(require('cookie-parser')());

require('dotenv').config()

app.use(express.static('app'));

app.get('/', function (req, res) {
  if (!req.cookies.userId) {
    res.cookie('userId', uuidv4())
  }
  res.sendFile(path.join(__dirname+ '/app/pages/index.html'));
});
app.use(express.static(__dirname + '/app/pages',{ extensions:['html'] }));

// Fetch modules
require('./modules/room')(app);
require('./modules/select')(app);
require('./modules/game')(app);

server.listen(process.env.PORT);

