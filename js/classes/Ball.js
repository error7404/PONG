import * as THREE from 'three';
import { Cube } from './Cube.js';
import { Paddle } from './Paddle.js';

/**
 * @typedef {Object} Point
 * @property {number} x - The x coordinate.
 * @property {number} y - The y coordinate.
 * @property {number} z - The z coordinate.
 */

class Ball extends Cube {
	constructor(position = {x: 0, y:0, z:0}, direction = new THREE.Vector2(1, 1), speed = 10, size = 0.25, color = 0xFFFFFF) {
		super(position, size, color);
		this.speed = speed;
		this.timeout = 0;
		this.setDirection(direction);
	}

	/**
	 * Sets the direction of the ball and normalizes it
	 * @param {THREE.Vector2} direction The new direction of the ball
	 */
	setDirection(direction) {
		this.direction = {
			x: direction.x,
			y: direction.y
		};
		let magnitude = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
		this.direction.x /= magnitude;
		this.direction.y /= magnitude;
	}

	reset(step, p) {
		this.direction.x *= -1;
		this.mesh.visible = false;
		this.timeout = 10//0;
		step.x = 0;
		this.speed *= 0.8;
	}

	/**
	 * Checks if the ball will hit a paddle on the next step and returns the height at which it will hit the paddle
	 * @param {Paddle} paddle The paddle to check for collision
	 * @param {Point} step The position of the ball after the next step
	 * @param {Point} position The current position of the ball
	 * @returns {Number} The height at which the ball hit the paddle, or -1 if it didn't hit the paddle
	 */
	paddleInteraction(paddle, step, position) {
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
			return (Math.min(Math.max(position.y - paddle.mesh.position.y + paddle.height / 2, 0), paddle.height));
		return (-1);
	}

	update(delta, p) {
		if (this.timeout > 0) {
			if (this.timeout == 1)
			this.mesh.visible = true;
			this.timeout--;
			return;
		}
		if (this.speed > p.rules.ballMaxSpeed)
			this.speed = p.rules.ballMaxSpeed;
		if (this.speed < 2)
			this.speed = 2;
		const step = {
			x: this.mesh.position.x + this.direction.x * this.speed * p.camera.aspect * 0.5 * delta,
			y: this.mesh.position.y + this.direction.y * this.speed * p.camera.aspect * 0.5 * delta
		}
		
		if (step.y>= p.rules.maxHeight - this.size / 2) {
			this.mesh.position.y = p.rules.maxHeight - this.size / 2 + .01;
			if (this.direction.y > 0)
				this.direction.y *= -1;
		}
		if (step.y <= -p.rules.maxHeight + this.size / 2) {
			this.mesh.position.y = -p.rules.maxHeight + this.size / 2 - .01;
			if (this.direction.y < 0)
				this.direction.y *= -1;
		}

		const paddleRIntersection = this.paddleInteraction(p.meshes.paddleR, step, this.mesh.position);
		if (paddleRIntersection != -1 && this.direction.x > 0) {
			if (step.x >= p.rules.maxWidth - this.size / 2)
				step.x = p.rules.maxWidth - this.size / 2;
			this.direction.x *= -1;
			this.setDirection(new THREE.Vector2(this.direction.x, paddleRIntersection / p.meshes.paddleR.height * 2 - 1));
			p.meshes.paddleR.bump(p);
			this.speed *= 1.1;
			return;
		}
		const paddleLIntersection = this.paddleInteraction(p.meshes.paddleL, step, this.mesh.position);
		if (paddleLIntersection != -1 && this.direction.x < 0) {
			if (step.x <= -p.rules.maxWidth + this.size / 2)
				step.x = -p.rules.maxWidth + this.size / 2;
			this.direction.x *= -1;
			this.setDirection(new THREE.Vector2(this.direction.x, paddleLIntersection / p.meshes.paddleL.height * 2 - 1));
			p.meshes.paddleL.bump(p);
			this.speed *= 1.1;
			return;
		}

		if (step.x >= p.rules.maxWidth - this.size / 2)	{
			this.mesh.position.x = p.rules.maxWidth - this.size / 2;
			this.reset(step, p);
			p.scoreL = ++document.getElementById('scoreL').innerHTML;
		}
		else if (step.x <= -p.rules.maxWidth + this.size / 2) {
			this.mesh.position.x = -p.rules.maxWidth + this.size / 2;
			this.reset(step, p);
			p.scoreR = ++document.getElementById('scoreR').innerHTML;
		}

		this.mesh.position.x = step.x;
		this.mesh.position.y = step.y;
	}
}

export { Ball };