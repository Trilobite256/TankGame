$(function () {
    var socket = io();

    $('form').submit(function (event) {
        event.preventDefault();
        socket.emit('player name', $('#playerName').val(), function(data) {
            if (data) {
                document.getElementById('modal-wrapper').style.display='none';
            } else {
                $("#errorMessage").html("2 Players are already playing");
            }
        });
        $('#playerName').val('');
    });

    socket.on('playernames', function (data) {
        $('#playerName1').html("" + data[0]);
        if (data[1]) {
            $('#playerName2').html("" + data[1]);
        }
    });
});