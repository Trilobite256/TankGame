function TankView(tankController, tankModel) {
    this.tankController = tankController;
    this.tankModel = tankModel;

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resetCanvas();
    this.deltaX = 0;
    this.mouseX = 0;
    this.mouseY = 0;
}

TankView.prototype = {

    init: function () {
        this.addListeners();
    },

    addListeners: function () {

        window.addEventListener('mousemove', (event) => {
            this.tankController.calculateAngle(event);
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        $(document).keydown((event) => {
            switch (event.which) {
                case 37: // left arrow key 
                    if (this.tankModel.turret.x + this.deltaX > 50) {
                        this.deltaX -= 5;
                    }
                    break;
                case 39: // right arrow key
                    if ((this.tankModel.turret.x + this.deltaX) < (window.innerWidth - 50)) {
                        this.deltaX += 5;
                    }
                    break;
            }
        });
        
        $("#gameSpace").click(() => {
            this.tankController.createBullet();
        });
    },

    resetCanvas: function () {
        this.canvas.width = window.innerWidth * 0.99;
        this.canvas.height = window.innerHeight * 0.80;
    },

    renderGun: function () {
        this.ctx.setTransform(1, 0, 0, 1, this.tankModel.turret.x + this.deltaX, this.tankModel.turret.y);

        this.ctx.rotate(this.tankModel.turret.angle);

        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.rect(0, 0, 60, 0);
        this.ctx.stroke();
    },

    renderTurret: function () {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.beginPath();
        this.ctx.arc(this.tankModel.turret.x + this.deltaX, this.tankModel.turret.y, this.tankModel.turret.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.strokeStyle = '#000000';
        this.ctx.fill();
    },

    renderTank: function () {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.rect(this.tankModel.tank.x + this.deltaX, 
                      this.tankModel.tank.y, 
                      this.tankModel.tank.height, 
                      this.tankModel.tank.width);
        this.ctx.stroke();
    },

    
    insideWindow: function(x, y) {
        return x < this.canvas.width &&
            y < this.canvas.height &&
            x > 0 &&
            y > 0;
    },

    updateBulletsPosition: function(bullet, index) {
    
        if (this.insideWindow(bullet.x, bullet.y)) {
            bullet.x += bullet.mouseDist * Math.cos(bullet.angle);
            bullet.y += bullet.mouseDist * Math.sin(bullet.angle);
    
            this.ctx.beginPath()
            this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
        } else {
            this.tankModel.bullets.splice(index, 1);
        }

    }, 

    draw: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderTurret();
        this.renderTank();

        for (let i = 0; i < this.tankModel.bullets.length; ++i) {
            this.updateBulletsPosition(this.tankModel.bullets[i], i);
            if (this.tankController.tankBulletCollision(this.tankModel.bullets[i], this.tankModel.tank)) {
                // alert("hit");
            }
        }

        this.renderGun();
    }
}
