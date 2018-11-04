function TankModel() {
    this.tank = {
        x: 0,
        y: 0,
        height: 75,
        width: 40
    }

    this.turret = {
        x: this.tank.height / 2,
        y: this.tank.width / 2,
        radius: 12,
        angle: Math.random() * Math.PI * 2
    }

    this.bullets = [];
}

TankModel.prototype = {

    addBullets: function (x, y, mouseDist, angle) {
        this.bullets.push({
            x: x,
            y: y,
            radius: this.turret.radius / 2,
            mouseDist: mouseDist,
            angle: angle
        });
    }
}