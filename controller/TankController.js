function TankController() {
    this.tankModel = new TankModel(this);
    this.tankView = new TankView(this, this.tankModel);
}

TankController.prototype = {

    calculateAngle: function(mouseEvent) {
        if (!mouseEvent) return;
        let vx = mouseEvent.clientX - (this.tankModel.turret.x + this.tankView.deltaX);
        let vy = mouseEvent.clientY - this.tankModel.turret.y;
        this.tankModel.turret.angle = Math.atan2(vy, vx);
    },

    createBullet: function () {
        let angle = this.tankModel.turret.angle;
        let vx = this.tankView.mouseX - (this.tankModel.turret.x + this.tankView.deltaX);
        let vy = this.tankView.mouseY - this.tankModel.turret.y;
        let mouseDist = Math.sqrt(
                            Math.sqrt(
                               Math.abs(vx - (this.tankModel.turret.x + this.tankView.deltaX)))
                            + Math.sqrt(
                                Math.abs(vy - this.tankModel.turret.y)
                            )
                        );
        let x = this.tankModel.turret.x + this.tankView.deltaX;
        let y = this.tankModel.turret.y;
        this.tankModel.addBullets(x, y, mouseDist, angle);
    },

    tankBulletCollision: function(bullet, tank) {
        var distX = Math.abs(bullet.x - tank.x - tank.width / 2);
        var distY = Math.abs(bullet.x - tank.y - tank.width / 2);

        if (distX > (tank.width / 2 + bullet.radius)) {
            return false;
        }
        if (distY > (tank.height / 2 + bullet.radius)) {
            return false;
        }
        if (distX <= (tank.width / 2)) {
            return true;
        }
        if (distY <= (tank.height / 2)) {
            return true;
        }

        var dx = distX - tank.width / 2;
        var dy = distY - tank.height / 2;
        return (dx * dx + dy * dy <= (bullet.radius * bullet.radius));
    }

}

window.onload = function() {
    let tankController = new TankController();
    tankController.tankView.init();

    function animate() {
        requestAnimationFrame(animate);
        tankController.tankView.draw();
    }

    animate();

    window.onresize = () => {
        tankController.tankView.resetCanvas();
    }
}
