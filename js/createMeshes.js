import * as THREE from 'three';
import { Paddle } from './classes/Paddle.js';
import { Ball } from './classes/Ball.js';
import texturePath from '../textures/center_line.png';

/**
 * Creates the meshes of the game
 * @param {*} scene The scene to add the meshes to
 * @param {Number} visibleWidth The width of the visible area
 * @param {Number} visibleHeight The height of the visible area
 * @param {*} rules The rules of the game
 * @returns {Object} An object containing the meshes
 */
function createMeshes(scene, visibleWidth, visibleHeight, rules) {

	const meshes = {};

	const texture = new THREE.TextureLoader().load(texturePath);
	texture.repeat.set(1, visibleHeight);
	texture.wrapT = THREE.RepeatWrapping;
	texture.minFilter = THREE.NearestFilter;
	texture.magFilter = THREE.NearestFilter;
	const centerLine = new THREE.Mesh(
		new THREE.PlaneGeometry(.1, visibleHeight),
		new THREE.MeshBasicMaterial({ map: texture })
	);
	scene.add(centerLine);

	const ball = new Ball({ x: 0, y: 0, z: 0 }, new THREE.Vector2(-1, -1.3), rules.ballSpeed);
	meshes.ball = ball;
	scene.add(ball.mesh);

	const paddleL = new Paddle({ x: -(visibleWidth / 2) / 1.2, y: 0, z: 0 }, { 'up': 'KeyW', 'down': 'KeyS' });
	meshes.paddleL = paddleL;
	scene.add(paddleL.mesh);
	const paddleR = new Paddle({ x: (visibleWidth / 2) / 1.2, y: 0, z: 0 }, { 'up': 'ArrowUp', 'down': 'ArrowDown' });
	meshes.paddleR = paddleR;
	scene.add(paddleR.mesh);

	return (meshes);
}

export { createMeshes };