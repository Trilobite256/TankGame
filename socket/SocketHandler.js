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

    socket.on('player name', function (pname) {
        $('#playerName1').append("" + pname);
    });
});