function TankView(tankController) {
    this.tankController = tankController;

    this.canvas = document.getElementById('player1tank');
    this.ctx = this.canvas.getContext('2d');
    this.resetCanvas();

    this.tank = {
        height: 75,
        width: 40
    }

    this.turret = {
        x: this.tank.height / 2,
        y: this.tank.width / 2,
        radius: 12,
        angle: Math.random() * Math.PI * 2
    }

    this.deltaX = 0;
}

TankView.prototype = {

    init: function () {
        this.addListeners();
    },

    addListeners: function () {

        window.addEventListener('mousemove', (event) => {
            this.tankController.calculateAngle(event);
        });

        $(document).keydown((event) => {
            switch (event.which) {
                case 37: // left arrow key 
                    console.log("left pressed");
                    this.deltaX -= 2;
                    break;
                case 39: // right arrow key 
                    console.log("right pressed");
                    this.deltaX += 2;
                    break;
            }

            animate();
        });

        $("#gameSpace").click(() => {
            this.shootBullets();
        });
    },

    resetCanvas: function() {
        this.canvas.width = window.innerWidth * 0.80;
        this.canvas.height = window.innerHeight * 0.80;
    },

    renderGun: function () {
        this.ctx.setTransform(1, 0, 0, 1, this.turret.x + this.deltaX, this.turret.y);

        this.ctx.rotate(this.turret.angle);

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
        this.ctx.arc(this.turret.x + this.deltaX, this.turret.y, this.turret.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.strokeStyle = '#000000';
        this.ctx.fill();

        this.renderTank();
        this.renderGun();
    },

    renderTank: function () {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.rect(0 + this.deltaX, 0, this.tank.height, this.tank.width);
        this.ctx.stroke();
    },

    shootBullets: function() {
        this.ctx.setTransform(1, 0, 0, 1, this.turret.x + this.deltaX, this.turret.y);

        this.ctx.rotate(this.turret.angle);
        
        this.ctx.beginPath()
        this.ctx.arc(this.turret.x + this.deltaX, this.turret.y, this.turret.radius / 2, 0, Math.PI * 2);
        this.ctx.closePath();

    }
}
