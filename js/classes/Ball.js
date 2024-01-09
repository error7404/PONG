import * as THREE from 'three';
import { Cube } from './Cube.js';

class Ball extends Cube {
	constructor(position = {x: 0, y:0, z:0}, direction = new THREE.Vector2(1, 1), speed = 10, size = 0.25, color = 0xFFFFFF) {
		super(position, size, color);
		this.speed = speed;
		this.timeout = 0;
		this.setDirection(direction);
	}

	getSpeed() {
		return this.speed;
	}

	getDirection() {
		return this.direction;
	}

	setSpeed(speed) {
		this.speed = speed;
	}

	setDirection(direction) {
		this.direction = {
			x: direction.x,
			y: direction.y
		};
		let magnitude = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
		this.direction.x /= magnitude;
		this.direction.y /= magnitude;
	}

	paddleInteraction(paddle, step) {
		return (step.x <= paddle.getPosition().x + paddle.getWidth() / 2 + this.size / 2 &&
			step.x >= paddle.getPosition().x - paddle.getWidth() / 2 - this.size / 2 &&
			step.y <= paddle.getPosition().y + paddle.getHeight() / 2 + this.size / 2 &&
			step.y >= paddle.getPosition().y - paddle.getHeight() / 2 - this.size / 2);
	}

	update(delta, p) {
		if (this.timeout > 0) {
			if (this.timeout == 1)
				this.mesh.visible = true;
			this.timeout--;
			return;
		}
		const step = this.mesh.position;
		step.x += this.direction.x * this.speed * delta;
		step.y += this.direction.y * this.speed * delta;

		if (step.x >= p.rules.maxWidth - this.size / 2)	{
			this.mesh.position.x = p.rules.maxWidth - this.size / 2;
			this.direction.x *= -1;
			this.mesh.visible = false;
			this.setPosition(0, 0, 0);
			this.timeout = 100;
		}
		else if (step.x <= -p.rules.maxWidth + this.size / 2) {
			this.mesh.position.x = -p.rules.maxWidth + this.size / 2;
			this.direction.x *= -1;
			this.mesh.visible = false;
			this.setPosition(0, 0, 0);
			this.timeout = 100;
		}
		else if (this.paddleInteraction(p.meshes.paddleR, step) &&
			this.direction.x > 0) {
			this.direction.x *= -1;
			p.meshes.paddleR.bump(p);
		}
		else if (this.paddleInteraction(p.meshes.paddleL, step) &&
			this.direction.x < 0) {
			this.direction.x *= -1;
			p.meshes.paddleL.bump(p);
		}
		if (step.y>= p.rules.maxHeight - this.size / 2) {
			this.mesh.position.y = p.rules.maxHeight - this.size / 2;
			this.direction.y *= -1;
		}
		else if (step.y <= -p.rules.maxHeight + this.size / 2) {
			this.mesh.position.y = -p.rules.maxHeight + this.size / 2;
			this.direction.y *= -1;
		}
		this.mesh.position.x = step.x;
		this.mesh.position.y = step.y;
	}
}

export { Ball };