import * as THREE from 'three';

function render(p) {
	if (p.scoreL >= p.rules.maxPoints || p.scoreR >= p.rules.maxPoints)
	{
		const filter = document.getElementById('filter');
		filter.style.opacity = 1;
		const endScreen = document.getElementById('endScreen');
		endScreen.style.opacity = 1;
		if (p.scoreL >= p.rules.maxPoints)
			endScreen.innerHTML = `${p.meshes.paddleL.name} wins!`;
		else
			endScreen.innerHTML = `${p.meshes.paddleR.name} wins!`;
		p.promise({
			player1: p.meshes.paddleL.name,
			player2: p.meshes.paddleR.name,
			score1: p.scoreL,
			score2: p.scoreR
		});
		return;
	}

	const delta = p.clock.getDelta();

	for (const mesh in p.meshes) {
		p.meshes[mesh].update(delta, p);
	}

	p.composer.render(delta);

	requestAnimationFrame(() => render(p));
}

export { render };