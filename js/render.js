import * as THREE from 'three';

function render(time, p) {
	if (p.scoreL >= p.rules.maxPoints || p.scoreR >= p.rules.maxPoints)
	{
		console.log("the end");
		return;
	}

	const delta = p.clock.getDelta();

	for (const mesh in p.meshes) {
		p.meshes[mesh].update(delta, p);
	}

	p.composer.render(delta);

	requestAnimationFrame((time) => render(time, p));
}

export { render };