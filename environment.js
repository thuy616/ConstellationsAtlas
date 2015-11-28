
Environment = function(data) {
	this.data = data;
	this.planets;
	this.star;

	this.smallStars = 300;
	this.bigStars = 1200;

	this.Skybox = function() {
		var starfield = new THREE.Mesh(
			new THREE.SphereGeometry(100000, 32, 32), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('game/images/environment/'+this.data.env+'.jpg'), 
				side: THREE.BackSide
			})
		);

		return starfield;
	};

	this.StarDebris = function() {
		var i, r = 10, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
		var starContainer = new THREE.Object3D();

		for ( i = 0; i < this.smallStars; i ++ ) {

			var vertex = new THREE.Vector3();
			vertex.x = Math.random() * 2 - 1;
			vertex.y = Math.random() * 2 - 1;
			vertex.z = Math.random() * 2 - 1;
			vertex.multiplyScalar( r );

			starsGeometry[ 0 ].vertices.push( vertex );

		}

		for ( i = 0; i < this.bigStars; i ++ ) {

			var vertex = new THREE.Vector3();
			vertex.x = Math.random() * 2 - 1;
			vertex.y = Math.random() * 2 - 1;
			vertex.z = Math.random() * 2 - 1;
			vertex.multiplyScalar( r );

			starsGeometry[ 1 ].vertices.push( vertex );

		}

		var stars;
		var starsMaterials = [
			new THREE.ParticleSystemMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
			new THREE.ParticleSystemMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
			new THREE.ParticleSystemMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
			new THREE.ParticleSystemMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
			new THREE.ParticleSystemMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
			new THREE.ParticleSystemMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
		];

		for ( i = 10; i < 30; i ++ ) {

			stars = new THREE.ParticleSystem( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

			stars.rotation.x = Math.random() * 6;
			stars.rotation.y = Math.random() * 6;
			stars.rotation.z = Math.random() * 6;

			s = i * 10;
			stars.scale.set( s, s, s );

			stars.matrixAutoUpdate = false;
			stars.updateMatrix();

			starContainer.add(stars);
		}

		return starContainer;
	}

	this.SolarSystem = function() {
		this.planets = [];
		var solarsystem = new THREE.Object3D();

		// Create stars in solarsystem
		for (var i in this.data.stars) {
			this.star = makeSun(
			 	{
			 		radius: KMToLY(this.data.stars[i].radius),
			 		spectral: this.data.stars[i].spectral
			 	}
			 );
			solarsystem.add(this.star);
		};

		// Create planets in solarsystem
		for (var i in this.data.planets) {
			this.planets[i] = new PlanetBody({x: 0, y: 0, z: 0}, this.data.planets[i]);
			solarsystem.add(this.planets[i].createPlanet());
		};

		return solarsystem;
	};

	this.LoadEntities = function() {
		this.entities = [];

		socket.on('fetch.entities', function(data) {
			for(i in data) {
				this.entities[data.name] = new Ship(data.name, data);
			}
		});
	};
 
	this.update = function(camera) {
		this.camera = camera;
		for (var i in this.planets) {
			this.planets[i].updatePlanet();
		};

		this.star.update(this.camera);
	};
};