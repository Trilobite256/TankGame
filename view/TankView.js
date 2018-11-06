function TankView(tankController) {
    this.tankController = tankController;
    this.socket = 0;

    this.canvas = document.getElementById('canvas');
    this.resetCanvas();
    this.tanks = [];
    this.keys = {};

    // this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.deltaX = 0;
}

TankView.prototype = {

    init: function () {
        this.addListeners();
    },

    addListeners: function () {

        window.addEventListener('keydown', (event) => {
            this.keys[event.keyCode] = true;
        }, false);

        //check if key is not being pressed or has lifted up
        window.addEventListener('keyup', (event) => {
            delete this.keys[event.keyCode];
        }, false);

    },

    sortTanks: function() {
        if (this.tanks.length == 0 || this.tanks.length == 1) return;
        
        if (this.tanks[0].color == "green") {
            temp = this.tanks[0];
            this.tanks[0] = this.tanks[1];
            this.tanks[1] = temp;
        }
    }, 

    addNewTank: function (tank) {
        this.tanks.push(tank);
    },

    deleteTank: function (tank) {
        this.tanks.splice(this.tanks.indexOf(tank), 1);
    },

    resetCanvas: function () {
        this.canvas.width = window.innerWidth * 0.99;
        this.canvas.height = window.innerHeight * 0.80;
    },

    draw: function () {
        this.sortTanks();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0, k = this.tanks.length - 1; i < this.tanks.length; ++i, k--) {
            this.tanks[i].renderTurret();
            this.tanks[i].renderTank();

            for (let j = 0; j < this.tanks[i].bullets.length; ++j) {
                this.tanks[i].updateBulletsPos(this.tanks[i].bullets[j], j);
                if (this.tanks.length >= 2 &&
                    this.tankController.tankBulletCollision(this.tanks[i].bullets[j], this.tanks[k])) {
                    
                        this.tanks[i].bullets.splice(j, 1);
                        if (this.tanks[k].lives > 0) {
                            this.tanks[k].lives--;
                        }

                }
            }

            this.tanks[i].renderGun();
        }
    }
}

class Tank {
    constructor(canvas, x, y, height, width, color, ctank) {
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

        this.clientTank = ctank;
        this.lives = 3;

        this.turret = {
            x: (this.height / 2) + this.x,
            y: (this.width / 2) + this.y,
            radius: 12,
            angle: Math.random() * Math.PI * 2
        }

        this.bullets = [];
    }

    calculateAngle() {
        let vx = this.mouseX - (this.turret.x + this.deltaX);
        let vy = this.mouseY - this.turret.y;
        this.turret.angle = Math.atan2(vy, vx);
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
        if (this.clientTank) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
