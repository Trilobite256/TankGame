function TankView(tankController) {
    this.tankController = tankController;

    this.canvas = document.getElementById('player1tank');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.tank = {
        height: 75,
        width: 40
    }

    this.turret = {
        x: this.tank.height / 2,
        y: this.tank.width / 2,
        radius: 15,
        angle: Math.random() * Math.PI * 2
    }
}

TankView.prototype = {

    init: function () {
        this.addListeners();
    },

    addListeners: function () {
        const self = this;

        window.addEventListener('mousemove', (event) => {
            this.tankController.calculateAngle(event);
        });

        $(document).keydown((event) => {
            switch (event.which) {
                case 37: // left arrow key 
                    $("#player1tank").finish().animate({
                        left: "-=5"
                    });
                    break;
                case 39: // right arrow key 
                    $("#player1tank").finish().animate({
                        left: "+=5"
                    });
                    break;
            }
        });
    },

    renderGun: function () {
        this.ctx.setTransform(1, 0, 0, 1, this.turret.x, this.turret.y);

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
        this.ctx.arc(this.turret.x, this.turret.y, this.turret.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.fill();

        this.renderTank();
        this.renderGun();
    },

    renderTank: function () {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.rect(0, 0, this.tank.height, this.tank.width);
        this.ctx.stroke();
    }
}
