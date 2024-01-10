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
		maxPoints: 11,
		paddleSpeed: 10,
		ballSpeed: 10,
		ballMaxSpeed: 20
	}

	const meshes = {};

	const ball = new Ball({x:0, y:0, z:0}, new THREE.Vector2(-1, -1.3), rules.ballSpeed);
	meshes.ball = ball;
	scene.add(ball.mesh);

	const paddleL = new Paddle({x:-(visibleWidth / 2) / 1.2, y:0, z:0}, {'up': 'KeyW', 'down': 'KeyS'});
	meshes.paddleL = paddleL;
	scene.add(paddleL.mesh);
	const paddleR = new Paddle({x:(visibleWidth / 2) / 1.2, y:0, z:0}, {'up': 'ArrowUp', 'down': 'ArrowDown'});
	meshes.paddleR = paddleR;
	scene.add(paddleR.mesh);

	let testPaddle = new Paddle({x:0, y:0, z:0}, {'up': 'KeyW', 'down': 'KeyS'}, .1, .5, 0x00FF00);
	meshes.testPaddle = testPaddle;
	testPaddle.mesh.visible = false;
	scene.add(testPaddle.mesh);
	let testPaddle0 = new Paddle({x:0, y:0, z:0}, {'up': 'KeyW', 'down': 'KeyS'}, .1, .5, 0xFF0000);
	meshes.testPaddle0 = testPaddle0;
	testPaddle0.mesh.visible = false;
	scene.add(testPaddle0.mesh);
	let testPaddle1 = new Paddle({x:0, y:0, z:0}, {'up': 'KeyW', 'down': 'KeyS'}, .1, .5, 0x0000FF);
	meshes.testPaddle1 = testPaddle1;
	testPaddle1.mesh.visible = false;
	scene.add(testPaddle1.mesh);
	let testPaddle2 = new Paddle({x:0, y:0, z:0}, {'up': 'KeyW', 'down': 'KeyS'}, .1, .5, 0xFFFF00);
	meshes.testPaddle2 = testPaddle2;
	testPaddle2.mesh.visible = false;
	scene.add(testPaddle2.mesh);
	let testPaddle3 = new Paddle({x:0, y:0, z:0}, {'up': 'KeyW', 'down': 'KeyS'}, 1, .5, 0x00FFFF);
	meshes.testPaddle3 = testPaddle3;
	testPaddle3.mesh.visible = false;
	scene.add(testPaddle3.mesh);

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
		rules: rules,
		scoreL: 0,
		scoreR: 0
	};

	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		const visibleWidth = visibleHeight * camera.aspect;
		proprietes.rules.maxWidth = visibleWidth / 2;
		paddleL.mesh.position.x = -(visibleWidth / 2) / 1.2;
		paddleR.mesh.position.x = (visibleWidth / 2) / 1.2;
		if (ball.mesh.position.x > rules.maxWidth - ball.size / 2)
		{
			ball.mesh.position.x = rules.maxWidth - ball.size / 2;
			if (ball.direction.x > 0)
				ball.direction.x *= -1;
		}
		else if (ball.mesh.position.x < -rules.maxWidth + ball.size / 2)
		{
			ball.mesh.position.x = -rules.maxWidth + ball.size / 2;
			if (ball.direction.x < 0)
				ball.direction.x *= -1;
		}
	});

	requestAnimationFrame((time) => render(time, proprietes));
}

window.addEventListener('load', main);