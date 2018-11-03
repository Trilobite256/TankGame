function TankView(tankController) {
    this.tankController = tankController;

    this.canvas = document.getElementById("player1");
    this.ctx = this.canvas.getContext('2d');

    this.turret = {
        x: 320,
        y: 160,
        radius: 15,
        angle: Math.random() * Math.PI * 2
    }
}

TankView.prototype = {

    init = () => {
        this.addListeners()
    },

    addListeners = () => {
        const self = this;

        window.addEventListener('mousemove', (event) => {
            this.tankController.calculateAngle(event);
        });
    },

    renderGun = () => {
        this.ctx.setTransform(1, 0, 0, 1, this.turret.x, this.turret.y);

        this.ctx = ctx.rotate(this.turret.angle);

        this.ctx.beginPath();
        this.ctx.lineWidth = 2
        this.ctx.rect(0, 0, 60, 0);
        this.ctx.stroke();
    },

    renderTurret = () => {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.beginPath();
        this.ctx.arc(this.turret.x, this.turret.y, this.turret.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.fill();

        this.renderGun();
    },

    renderTank = () => {

    }
}
