function TankController() {
    this.tankView = new TankView(this);
}

TankController.prototype = {

    calculateAngle = (mouseEvent) => {
        if (!mouseEvent) return;
        let vx = e.clientX - this.tankView.turret.x;
        let vy = e.clientY - this.tankView.turret.y;
        tankView.turret.angle = Math.atan2(vy, vx);
    }

}

window.onload = function() {
    let tankController = new Controller();

    function animate() {
        tankController.tankView.renderTurret();
        requestAnimationFrame(animate);
    }

    animate();
}