Player = function(name, user) {
	this.name = name;
	this.user = user;

	this.ui = new UI(this.user);

	var shipContainer = new THREE.Object3D();
	shipContainer.userData = {
		entity: 'ship',
		name: this.name,
		model: this.user.ship.model
	};

	var bounding = new Physijs.SphereMesh(
		new THREE.SphereGeometry(.01, 64, 64),
		Physijs.createMaterial(
			new THREE.Material({
				opacity: 0
			}),
			1.0, // high friction
			0.0 // low restitution
		),
		0.1
	);

	this.createShip = function(scene, camera, renderer) {
		ship = new Ship(this.user, this.name);

		ship.loadModel(function(object3d) {
			shipContainer.add(object3d)
		});

		bounding.position.set(this.user.ship.position.x, this.user.ship.position.y, this.user.ship.position.z);
		bounding.rotation.set(this.user.ship.rotation.x, this.user.ship.rotation.y, this.user.ship.rotation.z);
		bounding.add(shipContainer);
		bounding.name = this.name;
		
		this.controls = new THREE.PlayerControls(bounding, scene, shipContainer, camera, renderer.domElement);
		this.controls.minDistance = 0.1;
		this.controls.maxSpeed = this.user.ship.maxSpeed;
		this.controls.acceleration = this.user.ship.acceleration;

		this.ui.create();

		socket.emit('fetch.entities');
	}

	this.syncPlayer = function() {
		socket.emit('player.move', {
			name: this.name, 
			position: {x: bounding.position.x, y: bounding.position.y, z: bounding.position.z},
			rotation: {x: bounding.rotation.x, y: bounding.rotation.y, z: bounding.rotation.z}
		});
	}
 
	this.getShip = function() {
		return bounding;
	}

	this.update = function(delta) {
		if(this.controls) {
			this.controls.update();
			this.ui.update({velocity: this.controls.getVelocity()});
		}
	}
};