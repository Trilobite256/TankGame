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
        if (!bullet) return;
        
        let check1 = bullet.x < (tank.x + (tank.width * 2));
        let check2 = bullet.x > tank.x; 
        let check3 = bullet.y < (tank.y + (tank.height * 2));
        let check4 = bullet.y > tank.y
        return check1 && check2 && check3 && check4;
    }

}

window.onload = function() {
    // document.getElementById('modal-wrapper').style.display='block';

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
