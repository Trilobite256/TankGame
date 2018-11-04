function TankModel() {
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

    this.bullets = [];
}

TankModel.prototype = {

    addBullets: function (x, y, mouseDist, angle) {
        this.bullets.push({
            x: x,
            y: y,
            mouseDist: mouseDist,
            angle: angle
        });
    }
}