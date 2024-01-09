import * as THREE from 'three';

class Cube {
	constructor(position = {x: 0, y:0, z:0}, size, color) {
		this.x = position.x;
		this.y = position.y;
		this.z = position.z;
		this.size = size;
		this.color = color;
		this.geometry = new THREE.BoxGeometry(this.size, this.size, 0);
		this.material = new THREE.MeshBasicMaterial({ color: this.color });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(this.x, this.y, this.z);
	}

	getMesh() {
		return this.mesh;
	}

	setPosition(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.mesh.position.set(this.x, this.y, this.z);
	}

	setSize(size) {
		this.size = size;
		this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
	}

	setColor(color) {
		this.color = color;
		this.material = new THREE.MeshBasicMaterial({ color: this.color });
	}

	update(delta, p) {
		const time = p.clock.getElapsedTime();
		this.mesh.position.x = this.x + Math.cos(time);
		this.mesh.position.y = this.y + Math.sin(time);
	}
}

export { Cube };