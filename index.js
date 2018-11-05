var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var playernames = [];
var tanks = [];

app.use('/view', express.static(__dirname + '/view'));
app.use('/model', express.static(__dirname + '/model'));
app.use('/controller', express.static(__dirname + '/controller'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/socket', express.static(__dirname + '/socket'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('player name', function (data, callback) {
    if (playernames.length >= 2) {
      callback(false);
    } else {
      callback(true);
      socket.playername = data;
      playernames.push(socket.playername);
      io.sockets.emit("playernames", playernames);
    }
  });

  socket.on('new tank', function (tank) {
    if (!socket.tank) {
      socket.tank = tank;
    }
    tanks.push(tank);
    io.sockets.emit("tanks", tank);
  });

  socket.on('pressed', (key, width) => {
    if (key === 37) {
      if (socket.tank.turret.x + socket.tank.deltaX > 50) {
        socket.tank.deltaX -= 5;
        socket.emit('playermoving', tanks);
        socket.broadcast.emit('playermoving', tanks);
      }
    }

    if (key === 39) {
      if ((socket.tank.x + socket.tank.deltaX) < (width - 85)) {
        socket.tank.deltaX += 5;
        socket.emit('playermoving', tanks);
        socket.broadcast.emit('playermoving', tanks);
      }
    }

  });

  socket.on('mousemoved', (data) => {
    socket.emit('mousemoving', data);
    socket.broadcast.emit('mousemoving', data);
  });

  socket.on('clicked', (data) => {
    socket.emit('mouseclicked', socket.tank);
  });

  socket.on('disconnect', function (data) {
    if (!socket.playername || !socket.tank) return;
    playernames.splice(playernames.indexOf(socket.playername), 1);
    tanks.splice(tanks.indexOf(socket.tank), 1);
    io.sockets.emit("playerleft", playernames, socket.tank);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
