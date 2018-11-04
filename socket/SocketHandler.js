$(function () {
    var socket = io();
    $('form').submit(function () {
        socket.emit('chat message', $('#playerName').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
});