function TankView(tankController, tankModel) {
    this.tankController = tankController;
    this.tankModel = tankModel;

    this.canvas = document.getElementById('canvas');
    this.resetCanvas();
    this.clientTank = new Tank(this.canvas, 0, 0, 75, 40, "red", true);
    this.opponentTank = new Tank(this.canvas, 0, this.canvas.height - 41, 75, 40, "green", false);

    // this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.deltaX = 0;
}

TankView.prototype = {

    init: function () {
        this.addListeners();
    },

    addListeners: function () {

        window.addEventListener('mousemove', (event) => {
            this.clientTank.calculateAngle(event);
            this.opponentTank.calculateAngle(event);
        });

        $(document).keydown((event) => {
            switch (event.which) {
                case 37: // left arrow key 
                    if (this.clientTank.turret.x + this.clientTank.deltaX > 50) {
                        this.clientTank.deltaX -= 5;
                    }
                    break;
                case 39: // right arrow key
                    if ((this.clientTank.turret.x + this.deltaX) < (window.innerWidth - 50)) {
                        this.clientTank.deltaX += 5;
                    }
                    break;
            }
        });

        $("#gameSpace").click(() => {
            this.clientTank.createBullet();
            this.opponentTank.createBullet();
        });
    },

    resetCanvas: function () {
        this.canvas.width = window.innerWidth * 0.99;
        this.canvas.height = window.innerHeight * 0.80;
    },

    draw: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.clientTank.render();
        this.opponentTank.render();

        this.clientTank.renderTurret();
        this.opponentTank.renderTurret();
        this.clientTank.renderTank();
        this.opponentTank.renderTank()

        for (let i = 0; i < this.clientTank.bullets.length; ++i) {
            this.clientTank.updateBulletsPos(this.clientTank.bullets[i], i);
            if (this.tankController.tankBulletCollision(this.clientTank.bullets[i], this.opponentTank)) {
                console.log("hit");
            }
        }

        this.clientTank.renderGun();
        this.opponentTank.renderGun();
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
        if (this.clientTank) {
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

    render() {
        this.renderTurret();
        this.renderTank();

        for (let i = 0; i < this.bullets.length; ++i) {
            this.updateBulletsPos(this.bullets[i], i);
            // if (this.tankController.tankBulletCollision(this.tankModel.bullets[i], this.tankModel.tank)) {
            //     // alert("hit");
            // }
        }

        this.renderGun();
    }
} 
