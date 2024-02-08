import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { InvertShader } from './shaders/invertShader.js';
import { createMeshes } from './createMeshes.js';
import { createEventListeners } from './eventListeners.js';
import { render } from './render.js';

function main() {
	const canvas = document.querySelector('#canvas');
	const renderer = new THREE.WebGLRenderer({ canvas });
	renderer.setSize(window.innerWidth, window.innerHeight);
	const aspect = window.innerWidth / window.innerHeight;
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
		maxWidth: visibleWidth / 2,
		maxPoints: 11,
		paddleSpeed: 10,
		ballSpeed: 10,
		ballMaxSpeed: 20,
		pointTimeout: 10,//100,
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
	const renderPass = new RenderPass(scene, camera);
	composer.addPass(renderPass);
	const piexelsPass = new RenderPixelatedPass(1, scene, camera, {normalEdgeStrength: 10000});
	composer.addPass(piexelsPass);
	const invertShader = new ShaderPass(InvertShader);
	composer.addPass(invertShader);
	const antiAliasingPass = new ShaderPass(FXAAShader);
	antiAliasingPass.material.uniforms['resolution'].value.y = 1 / window.innerHeight;
	if (rules.antiAliasing)
		composer.addPass(antiAliasingPass);

	var proprietes = {
		clock: new THREE.Clock(),
		animations: animations,
		meshes: meshes,
		renderer: renderer,
		composer: composer,
		scene: scene,
		camera: camera,
		rules: rules,
		scoreL: 0,
		scoreR: 0
	};

	createEventListeners(proprietes, meshes.ball, meshes.paddleL, meshes.paddleR, rules, visibleHeight);

	requestAnimationFrame((time) => render(time, proprietes));
}

window.addEventListener('load', main);