import * as THREE from 'three';

class Paddle {
	constructor(position = {x: 0, y:0, z:0}, keys = {'up': 'ArrowUp', 'down': 'ArrowDown'}, width = 0.25, height = 1, color = 0xFFFFFF) {
		this.x = position.x;
		this.y = position.y;
		this.z = position.z;
		this.width = width;
		this.height = height;
		this.color = color;
		this.geometry = new THREE.BoxGeometry(this.width, this.height, 0);
		this.material = new THREE.MeshBasicMaterial({ color: this.color });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.x = this.x;
		this.mesh.position.y = this.y;
		this.mesh.position.z = this.z;
		this.mixer = new THREE.AnimationMixer(this.mesh);

		window.addEventListener('keydown', (event) => {
			if (event.code == keys.up)
				this.y += 0.1;
			if (event.code == keys.down)
				this.y -= 0.1;
		});
	}

	getMesh() {
		return this.mesh;
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	getPosition() {
		return {
			x: this.mesh.position.x,
			y: this.mesh.position.y,
			z: this.mesh.position.z
		};
	}

	setPosition(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.mesh.position.set(this.x, this.y, this.z);
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
		this.geometry = new THREE.BoxGeometry(this.width, this.height, 0);
	}

	setColor(color) {
		this.color = color;
		this.material = new THREE.MeshBasicMaterial({ color: this.color });
	}

	bump(p) {
		this.mixer = new THREE.AnimationMixer(this.mesh);
		this.clipAction = this.mixer.clipAction(p.animations[0]);
		this.clipAction.repetitions = 1;
		this.clipAction.play();
	}

	update(delta, p) {
		// this.mesh.position.y = this.y + Math.sin(p.clock.getElapsedTime()) * 4;
		if (this.mesh.position.y + this.height / 2 > p.rules.maxHeight)
			this.mesh.position.y = p.rules.maxHeight - this.height / 2;
		if (this.mesh.position.y - this.height / 2 < -p.rules.maxHeight)
			this.mesh.position.y = -p.rules.maxHeight + this.height / 2;
		this.mixer.update(delta);
	}
}

export { Paddle };