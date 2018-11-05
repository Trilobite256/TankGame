function TankController() {
    this.tankModel = new TankModel(this);
    this.tankView = new TankView(this, this.tankModel);
}

TankController.prototype = {

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
