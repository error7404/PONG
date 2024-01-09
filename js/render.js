import * as THREE from 'three';

function render(time, p) {
	const delta = p.clock.getDelta();

	for (const mesh in p.meshes) {
		p.meshes[mesh].update(delta, p);
	}

	p.renderer.render(p.scene, p.camera);

	requestAnimationFrame((time) => render(time, p));
}

export { render };