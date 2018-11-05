$(function () {
    var socket = io();

    var canvas = document.getElementById("canvas");
    
    var keys = {};

    window.addEventListener('keydown', function(e){
        keys[e.keyCode] = true; 
    }, false);
    
    //check if key is not being pressed or has lifted up
    window.addEventListener('keyup', function(e){
        delete keys[e.keyCode];
    }, false);

    function gameloop() {
        if (keys[37]) {
            socket.emit('pressed', 37);
        }
        if (keys[39]) {
            socket.emit('pressed', 39);
        }
        window.requestAnimationFrame(gameLoop);
    }
    window.requestAnimationFrame(gameLoop);

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

    socket.on('player joined', function(data) {
        for(let i = 0; i < data.length; i++) {
            var tank = new Tank(canvas, data[i].x, data[i].y, 
                                data[i].height, data[i], data[i].color, 
                                data[i].player1);
            tank.renderTurret();
            tank.renderTank();
            tank.renderGun();
        }
    });
});

class Tank {
    constructor(canvas, x, y, height, width, color, p1) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.deltaX = 0;
        this.color = color;

        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.mouseX = 0;
        this.mouseY = 0;

        this.player1 = p1;
        this.lives = 3;

        this.turret = {
            x: (this.height / 2) + this.x,
            y: (this.width / 2) + this.y,
            radius: 12,
            angle: Math.random() * Math.PI * 2
        }

        this.bullets = [];
    }

    calculateAngle(mouseEvent) {
        if (!mouseEvent) return;
        let vx = mouseEvent.clientX - (this.turret.x + this.deltaX);
        let vy = mouseEvent.clientY - this.turret.y;
        this.turret.angle = Math.atan2(vy, vx);
        this.mouseX = mouseEvent.clientX;
        this.mouseY = mouseEvent.clientY;
    }

    updateBulletsPos(bullet, index) {

        if (this.insideWindow(bullet.x, bullet.y)) {
            bullet.x += bullet.mouseDist * Math.cos(bullet.angle);
            bullet.y += bullet.mouseDist * Math.sin(bullet.angle);

            this.ctx.beginPath()
            this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
        } else {
            this.bullets.splice(index, 1);
        }
    }

    addBullets(x, y, mouseDist, angle) {
        this.bullets.push({
            x: x,
            y: y,
            radius: this.turret.radius / 2,
            mouseDist: mouseDist,
            angle: angle
        });
    }

    createBullet() {
        let angle = this.turret.angle;
        let vx = this.mouseX - (this.turret.x + this.deltaX);
        let vy = this.mouseY - this.turret.y;
        let mouseDist = Math.sqrt(
            Math.sqrt(
                Math.abs(vx - (this.turret.x + this.deltaX)))
            + Math.sqrt(
                Math.abs(vy - this.turret.y)
            )
        );
        let x = this.turret.x + this.deltaX;
        let y = this.turret.y;
        this.addBullets(x, y, mouseDist, angle);
    }

    insideWindow(x, y) {
        return x < this.canvas.width &&
            y < this.canvas.height &&
            x > 0 &&
            y > 0;
    }

    renderGun() {
        this.ctx.setTransform(1, 0, 0, 1, this.turret.x + this.deltaX, this.turret.y);

        this.ctx.rotate(this.turret.angle);

        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#000000';
        this.ctx.rect(0, 0, 60, 0);
        this.ctx.stroke();
    }

    renderTurret() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (this.player1) {
            this.ctx.clearRect(0, this.y, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.clearRect(0, this.y + 41, this.canvas.width, this.canvas.height);
        }
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.beginPath();
        this.ctx.arc(this.turret.x + this.deltaX, this.turret.y, this.turret.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.strokeStyle = '#000000';
        this.ctx.fill();
    }

    renderTank() {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.color;
        this.ctx.rect(this.x + this.deltaX,
            this.y,
            this.height,
            this.width);
        this.ctx.stroke();
    }
} 