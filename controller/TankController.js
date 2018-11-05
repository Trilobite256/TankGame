function TankController() {
    this.tankView = new TankView(this);
}

TankController.prototype = {

    tankBulletCollision: function(bullet, tank) {
        if (!bullet || !tank) return false;
        
        let check1 = bullet.x < (tank.x + (tank.width * 2));
        let check2 = bullet.x > tank.x; 
        let check3 = bullet.y < (tank.y + (tank.height * 2));
        let check4 = bullet.y > tank.y
        return check1 && check2 && check3 && check4;
    }

}

$(function() {
    var socket = io();

    document.getElementById('modal-wrapper').style.display='block';

    let tankController = new TankController();
    tankController.tankView.init();

    window.onresize = () => {
        tankController.tankView.resetCanvas();
    }

    window.addEventListener('mousemove', (event) => {
        socket.emit('mousemoved', {x: event.pageX, y: event.pageY});
    });

    $("#gameSpace").click(() => {
        socket.emit('clicked', {clicked: true})
    });

    function animate() {
        if (tankController.tankView.keys[37]) {
            socket.emit('pressed', 37, window.innerWidth);
        }
        if (tankController.tankView.keys[39]) {
            socket.emit('pressed', 39, window.innerWidth);
        }

        tankController.tankView.draw();
        requestAnimationFrame(animate);
    }

    animate();

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
            let player2Tank = new Tank(tankController.tankView.canvas, 0, canvas.height - 41, 75, 40, "green", false);
            tankController.tankView.addNewTank(player2Tank);
            socket.emit('new tank', player2Tank);
        } else {
            let player1Tank = new Tank(tankController.tankView.canvas, 0, 0, 75, 40, "red", true);
            tankController.tankView.addNewTank(player1Tank);
            socket.emit('new tank', player1Tank);
        }
    });

    socket.on('playerleft', function(data, tank) {
        $('#playerName1').html("" + data[0]);
        if (data[1]) {
            $('#playerName2').html("" + data[1]);
        } else {
            $('#playerName2').html("");
        }

        tankController.tankView.deleteTank(tank);

        tankController.tankView.draw();
    });

    socket.on('playermoving', function(data) {

        for(let i = 0; i < data.length; ++i) {
            tankController.tankView.tanks[i].deltaX = data[i].deltaX;
        }

    });

    socket.on('mousemoving', (data) => {

        for(let i = 0; i < tankController.tankView.tanks.length; ++i) {
            tankController.tankView.tanks[i].mouseX = data.x;
            tankController.tankView.tanks[i].mouseY = data.y;
            tankController.tankView.tanks[i].calculateAngle();
        }

    });

    socket.on('mouseclicked', (data) => {

        tankClicked = 0;
        for (let i = 0; i < tankController.tankView.tanks.length; ++i) {
            if (tankController.tankView.tanks[i].y == data.y) {
                tankClicked = tankController.tankView.tanks[i];
            }
        }

        tankClicked.createBullet();

    });
});
