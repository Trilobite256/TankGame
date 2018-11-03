import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.player = "N/A";
        this.lives = 3;
    }

    render() {
        return;
    }
}

class Turret extends React.Component {

    constructor(props) {
        super(props);
        this.x = props.x;
        this.y = props.y;
        this.base_radius = props.base_radius;
        this.angle = props.angle;

        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.binding();
    }

    createCanvas() {
        let canvas = "<canvas id='game' width='700' height='500'></canvas>";
        $("")
    }

    binding() {
        const self = this;
        window.addEventListener('mousemove', (event) => {
            self.calculateAngle(event);
        });
    }

    calculateAngle(event) {
        if (!event) {
            return;
        }
        let vx = event.clientX - this.x;
        let vy = event.clientY - this.y;
        this.angle = Math.atan2(vy, vx);
    }

    renderGun() {
        const turret_length = 60;
        this.ctx.setTransform(1, 0, 0, 1, this.x, this.y);

        this.rotate(this.angle);

        this.ctx.beginPath();
        this.ctx.lineWidth = turret_length;
        this.ctx.rect(0, 0, 60, 0);
    }

    render() {
        const canvas_width = $("#game").width();
        const canvas_height = $("#game").height();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, canvas_width, canvas_height);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.base_radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.strokeStyle = "#000000"
        this.ctx.lineWidth = 1;
        this.ctx.fill();

        this.renderGun();

        return;
    }
}

class Tank extends React.Component {
    constructor(props) {
        super(props);
    }

    renderTurret() {
        return (
            <Turret
                x={320}
                y={160}
                base_radius={15}
                angle={Math.random() * Math.PI * 2}
            />
        );
    }

    render() {
        return (
            <Turret
                x={320}
                y={160}
                base_radius={15}
                angle={Math.random() * Math.PI * 2}
            />
        );
    }
}

class Game extends React.Component {

}

// ==========================================
ReactDOM.render(
    <Tank />,
    document.getElementById('root')
)
