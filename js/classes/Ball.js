import * as THREE from 'three';
import { Cube } from './Cube.js';

class Ball extends Cube {
	constructor(position = {x: 0, y:0, z:0}, direction = new THREE.Vector2(1, 1), speed = 10, size = 0.25, color = 0xFFFFFF) {
		super(position, size, color);
		this.speed = speed;
		this.timeout = 0;
		this.setDirection(direction);
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

	paddleInteraction(paddle, step, position, meshes) {
		const halfSize = this.size / 2;
		const ballXChecks = [
			position.x - halfSize,
			step.x + halfSize,
			position.x + halfSize,
			step.x - halfSize,
		];
		const ballYChecks = [
			position.y - halfSize,
			step.y + halfSize,
			position.y + halfSize,
			step.y - halfSize,
		];
		
		if (Math.max(...ballXChecks) > paddle.mesh.position.x - paddle.width / 2 &&
			Math.min(...ballXChecks) < paddle.mesh.position.x + paddle.width / 2 &&
			Math.max(...ballYChecks) > paddle.mesh.position.y - paddle.height / 2 &&
			Math.min(...ballYChecks) < paddle.mesh.position.y + paddle.height / 2)
			return (true);
		return (false);
	}

	update(delta, p) {
		if (this.timeout > 0) {
			if (this.timeout == 1)
				this.mesh.visible = true;
			this.timeout--;
			return;
		}
		const step = {
			x: this.mesh.position.x + this.direction.x * this.speed * p.camera.aspect * 0.5 * delta,
			y: this.mesh.position.y + this.direction.y * this.speed * p.camera.aspect * 0.5 * delta
		}
		
		if (step.y>= p.rules.maxHeight - this.size / 2) {
			this.mesh.position.y = p.rules.maxHeight - this.size / 2;
			this.direction.y *= -1;
		}
		else if (step.y <= -p.rules.maxHeight + this.size / 2) {
			this.mesh.position.y = -p.rules.maxHeight + this.size / 2;
			this.direction.y *= -1;
		}

		if (this.paddleInteraction(p.meshes.paddleR, step, this.mesh.position, p.meshes) &&
			this.direction.x > 0) {
			if (step.x >= p.rules.maxWidth - this.size / 2)
				step.x = p.rules.maxWidth - this.size / 2;
			this.direction.x *= -1;
			p.meshes.paddleR.bump(p);
			return;
		}
		else if (this.paddleInteraction(p.meshes.paddleL, step, this.mesh.position, p.meshes) &&
			this.direction.x < 0) {
			if (step.x <= -p.rules.maxWidth + this.size / 2)
				step.x = -p.rules.maxWidth + this.size / 2;
			this.direction.x *= -1;
			p.meshes.paddleL.bump(p);
			return;
		}
		else if (step.x >= p.rules.maxWidth - this.size / 2)	{
			this.mesh.position.x = p.rules.maxWidth - this.size / 2;
			this.direction.x *= -1;
			this.mesh.visible = false;
			step.x = 0;
			step.y = 0;
			this.timeout = 100;
		}
		else if (step.x <= -p.rules.maxWidth + this.size / 2) {
			this.mesh.position.x = -p.rules.maxWidth + this.size / 2;
			this.direction.x *= -1;
			this.mesh.visible = false;
			step.x = 0;
			step.y = 0;
			this.timeout = 100;
		}

		this.mesh.position.x = step.x;
		this.mesh.position.y = step.y;
	}
}

export { Ball };