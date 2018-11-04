function TankController() {
    this.tankView = new TankView(this);
}

TankController.prototype = {

    calculateAngle: function(mouseEvent) {
        if (!mouseEvent) return;
        let vx = mouseEvent.clientX - (this.tankView.turret.x + this.tankView.deltaX);
        let vy = mouseEvent.clientY - this.tankView.turret.y;
        this.tankView.turret.angle = Math.atan2(vy, vx);
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
