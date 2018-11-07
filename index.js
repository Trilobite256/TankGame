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

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

  // io.emit("playerjoined", tanks);

  socket.on('player name', (data, callback) => {
    if (playernames.length >= 2) {
      callback(false);
    } else {
      callback(true);
      io.emit("playerjoined", tanks);
      socket.playername = data;
      playernames.push(socket.playername);
      io.sockets.emit("playernames", playernames);
      io.sockets.emit("tanks", tanks);
    }
  });

  socket.on('new tank', (tank) => {
    if (!socket.tank) {
      socket.tank = tank;
      tanks.push(socket.tank);
    }
  });

  socket.on('pressed', (key, width) => {

    if (key === 37) {
      if (socket.tank.turret.x + socket.tank.deltaX > 50) {
        socket.tank.deltaX -= 5;
        socket.emit('playermoving', socket.tank);
        socket.broadcast.emit('playermoving', socket.tank);
      }
    }

    if (key === 39) {
      if ((socket.tank.x + socket.tank.deltaX) < (width - 85)) {
        socket.tank.deltaX += 5;
        socket.emit('playermoving', socket.tank);
        socket.broadcast.emit('playermoving', socket.tank);
      }
    }

  });

  socket.on('mousemoved', (data) => {
    socket.emit('mousemoving', data, socket.tank);
    socket.broadcast.emit('mousemoving', data, socket.tank);
  });

  socket.on('lives', (data) => {
    if (data[0]) { 
      tanks[0].lives = data[0].lives;
    }
    if (data[1]) {
      console.log(data[1]);
      tanks[1].lives = data[1].lives;
    }
    socket.emit('lives', tanks);
    socket.broadcast.emit('lives', tanks);
  }); 

  socket.on('clicked', (data) => {
    socket.emit('mouseclicked', socket.tank);
    socket.broadcast.emit('mouseclicked', socket.tank);
  });

  socket.on('disconnect', (data) => {
    if (!socket.playername || !socket.tank) return;
    playernames.splice(playernames.indexOf(socket.playername), 1);
    tanks.splice(tanks.indexOf(socket.tank), 1);
    socket.broadcast.emit("playerleft", playernames, socket.tank);
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});
