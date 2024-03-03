import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { InvertShader } from './shaders/invertShader.js';
import { createMeshes } from './createMeshes.js';
import { createEventListeners } from './eventListeners.js';
import { render } from './render.js';

function createGame() {
	const canvas = document.querySelector('#canvas');
	const renderer = new THREE.WebGLRenderer({ canvas });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
	const aspect = canvas.clientWidth / canvas.clientHeight;
	const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
	camera.position.z = 7;

	const effect3D = true;
	if (effect3D) {
		camera.position.z = 7;
		camera.position.y = -1.5;
		camera.rotateX(THREE.MathUtils.degToRad(10));
	}

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xFFFFFF);

	const distance = Math.sqrt(camera.position.x**2 + camera.position.y**2 + camera.position.z**2);
	const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
	const visibleWidth = visibleHeight * aspect;
	const rules = {
		maxHeight: visibleHeight / 2,
		maxWidth: visibleWidth / 2 / 1.2,
		maxPoints: 11,
		paddleSpeed: 10,
		ballSpeed: 10,
		ballMaxSpeed: 20,
		pointTimeout: 100,
		effect3D: effect3D,
		antiAliasing: true,
	}

	const meshes = createMeshes(scene, visibleWidth, visibleHeight, rules);

	const animations = [new THREE.AnimationClip('bump', .2, [
		new THREE.VectorKeyframeTrack('.scale', [0, 0.1, 0.2], [
			1, 1, 1,
			1.5, 1.5, 1,
			1, 1, 1
		])
	])];

	const composer = new EffectComposer(renderer);
	composer.setSize(canvas.clientWidth, canvas.clientHeight);
	composer.setPixelRatio(window.devicePixelRatio);
	const renderPass = new RenderPass(scene, camera);
	composer.addPass(renderPass);
	const piexelsPass = new RenderPixelatedPass(1, scene, camera, {normalEdgeStrength: 10000});
	composer.addPass(piexelsPass);
	const invertShader = new ShaderPass(InvertShader);
	composer.addPass(invertShader);
	const antiAliasingPass = new ShaderPass(FXAAShader);
	antiAliasingPass.material.uniforms['resolution'].value.y = 1 / canvas.clientHeight;
	if (rules.antiAliasing)
		composer.addPass(antiAliasingPass);

	let properties = {
		clock: new THREE.Clock(),
		animations: animations,
		meshes: meshes,
		renderer: renderer,
		composer: composer,
		scene: scene,
		camera: camera,
		rules: rules,
		canvas: canvas,
		scoreL: 0,
		scoreR: 0
	};

	createEventListeners(properties, meshes.ball, meshes.paddleL, meshes.paddleR, rules, visibleHeight);
	return properties;
}

/**
 * @summary Launch a game of pong
 * @param {string} player1: name of the first player
 * @param {string} player2: name of the second player
 * @param {number} maxPoints: maximum points to win the game
 * @returns {Promise<Object>} a promise that resolves when the game is over with
 * an object with the following properties:
 * {player1: string, player2: string, score1: number, score2: number}
 */
function launchGame(player1 = "", player2 = "", maxPoints = -1) {
	return new Promise((resolve, reject) => {
		let properties = createGame();
		if (maxPoints > 0)
			properties.rules.maxPoints = maxPoints;
		properties.meshes.paddleL.name = player1;
		properties.meshes.paddleR.name = player2;
		properties.promise = resolve;
		
		requestAnimationFrame(() => render(properties));
	});
}

export { launchGame };