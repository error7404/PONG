import * as THREE from 'three';
import { render } from './render.js';
import { Paddle } from './classes/Paddle.js';
import { Ball } from './classes/Ball.js';

function main() {
	const canvas = document.querySelector('#canvas');
	const renderer = new THREE.WebGLRenderer({ canvas });
	renderer.setSize(window.innerWidth, window.innerHeight);
	const aspect = window.innerWidth / window.innerHeight;
	const camera = new THREE.PerspectiveCamera(80, aspect, 0.1, 5);
	camera.position.z = 5;

	const scene = new THREE.Scene();

	const distance = Math.abs(camera.position.z); // distance from camera to objects
	const visibleHeight = 2 * Math.tan( THREE.MathUtils.degToRad( camera.fov ) / 2 ) * distance;
	const visibleWidth = visibleHeight * aspect;
	const rules = {
		maxHeight: visibleHeight / 2,
		maxWidth: visibleWidth / 2,
		maxPoints: 5
	}

	const meshes = {};

	const ball = new Ball({x:0, y:0, z:0}, new THREE.Vector2(1, 0));
	meshes.ball = ball;
	scene.add(ball.getMesh());

	const paddleL = new Paddle({x:-(visibleWidth / 2) / 1.2, y:0, z:0}, {'up': 'KeyW', 'down': 'KeyS'});
	meshes.paddleL = paddleL;
	scene.add(paddleL.getMesh());
	const paddleR = new Paddle({x:(visibleWidth / 2) / 1.2, y:0, z:0}, {'up': 'ArrowUp', 'down': 'ArrowDown'});
	meshes.paddleR = paddleR;
	scene.add(paddleR.getMesh());

	const animations = [new THREE.AnimationClip('bump', .2, [
		new THREE.VectorKeyframeTrack('.scale', [0, 0.1, 0.2], [
			1, 1, 1,
			1.5, 1.5, 1,
			1, 1, 1
		])
	])];
	
	var proprietes = {
		clock: new THREE.Clock(),
		animations: animations,
		meshes: meshes,
		renderer: renderer,
		scene: scene,
		camera: camera,
		rules: rules
	};

	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		const visibleWidth = visibleHeight * camera.aspect;
		proprietes.rules.maxWidth = visibleWidth / 2;
		paddleL.setPosition(-(visibleWidth / 2) / 1.2, 0, 0);
		paddleR.setPosition((visibleWidth / 2) / 1.2, 0, 0);
	});

	requestAnimationFrame((time) => render(time, proprietes));
}

window.addEventListener('load', main);