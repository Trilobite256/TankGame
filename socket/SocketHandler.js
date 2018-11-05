// $(function () {
//     var socket = io();
    
//     var keys = {};

//     window.addEventListener('keydown', function(e){
//         keys[e.keyCode] = true; 
//     }, false);
    
//     //check if key is not being pressed or has lifted up
//     window.addEventListener('keyup', function(e){
//         delete keys[e.keyCode];
//     }, false);

//     function gameloop() {
//         if (keys[37]) {
//             socket.emit('pressed', 37);
//         }
//         if (keys[39]) {
//             socket.emit('pressed', 39);
//         }
//         window.requestAnimationFrame(gameLoop);
//     }
//     window.requestAnimationFrame(gameLoop);

//     $('form').submit(function (event) {
//         event.preventDefault();
//         socket.emit('player name', $('#playerName').val(), function(data) {
//             if (data) {
//                 document.getElementById('modal-wrapper').style.display='none';
//             } else {
//                 $("#errorMessage").html("2 Players are already playing");
//             }
//         });
//         $('#playerName').val('');
//     });

//     socket.on('playernames', function (data) {
//         $('#playerName1').html("" + data[0]);
//         if (data[1]) {
//             $('#playerName2').html("" + data[1]);
//         }
//     });

//     socket.on('player joined', function(data) {
//         for(let i = 0; i < data.length; i++) {
//             var tank = new Tank(canvas, data[i].x, data[i].y, 
//                                 data[i].height, data[i], data[i].color, 
//                                 data[i].player1);
//             tank.renderTurret();
//             tank.renderTank();
//             tank.renderGun();
//         }
//     });

//     socket.on('player moving'), function(players) {

//     }
// });