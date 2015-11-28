Entity = function(data) {
	this.data = data;
	// Server-side velocity, is not sent to the client
	this.velocity = new THREE.Vector3();

	// a normalized vector pointing in the direction the entity is heading.
	this.heading = new THREE.Vector3();

	//a vector perpendicular to the heading vector
	this.side = new THREE.Vector3();

	// Make additional properties
	if(this.data) {
		this.position = new THREE.Vector3(this.data.x, this.data.y, this.data.z);	
	}
	this.localPosition = new THREE.Vector3();

	/*
	this.rotx = this.rotx === undefined ? 0 : this.rotx;
	this.roty = this.roty === undefined ? 0 : this.roty;
	this.rotz = this.rotz === undefined ? 0 : this.rotz;

	this.rotation = new THREE.Vector3(this.rotx, this.roty, this.rotz);
	*/
	this.loadModel = function(onLoad){
		var loader	= new THREE.OBJMTLLoader();
		loader.addEventListener('load', function( event ){
				var object3d	= event.content
				object3d.scale.multiplyScalar(1/10000)
				// change emissive color of all object3d material - they are too dark
				object3d.traverse(function(object3d){
					if( object3d.material ){
						object3d.material.emissive.set(0x555555)
						object3d.material.ambient.set('white')
						object3d.material.specular.set(0xFF4400)
					}
				})
				// notify the callback
				onLoad	&& onLoad(object3d)
			});
		var objUrl	= 'game/models/'+this.model+'/'+this.model+'.obj';
		var mtlUrl	= 'game/models/'+this.model+'/'+this.model+'.mtl';
		loader.load(objUrl, mtlUrl);
	};
}

Ship = function(data, name) {
	this.name = name;
	this.data = data;
	this.model = this.data.ship.ship;
}
Ship.prototype = new Entity();

PlanetBody = function(data, planet) {
	this.planet = planet;

	var planetContainer = new THREE.Object3D();
	var planetObject = new THREE.Object3D();
	var planetOrbit = new THREE.Object3D();

	this.makePlanetObject = function() {
		if(this.planet.name == "earth") {
			return new THREE.Mesh(
				new THREE.SphereGeometry(this.planet.radius, 64, 64),
				new THREE.MeshPhongMaterial({
					map:         THREE.ImageUtils.loadTexture('game/images/2_no_clouds_4k.jpg'),
					bumpMap:     THREE.ImageUtils.loadTexture('game/images/elev_bump_4k.jpg'),
					bumpScale:   0.01,
					specularMap: THREE.ImageUtils.loadTexture('game/images/water_4k.png'),
					specular:    new THREE.Color('grey')					
				})
			);
		}else{
			return new THREE.Mesh(
				new THREE.SphereGeometry(this.planet.radius, 64, 64),
				new THREE.MeshPhongMaterial({
					map:         THREE.ImageUtils.loadTexture('game/images/planets/'+this.planet.name+'map.jpg'),
					specular:    new THREE.Color('grey')					
				})
			);
		}
	};

	this.createPlanet = function(drawOrbit, orbitColor) {
		this.drawOrbit = typeof drawOrbit !== 'undefined' ? drawOrbit : true;
		this.orbitColor = typeof orbitColor !== 'undefined' ? orbitColor : 0x444444;
		this.planet.radius = KMToLY(this.planet.radius);
		this.planet.moonObjects = [];

		var planet = this.makePlanetObject();
		planetObject.add(planet);
		planetObject.name = this.planet.name+" sphere";
		planetContainer.add(planetObject)
		planetContainer.name = this.planet.name;

		if(this.planet.orbit != false) {
			if(this.drawOrbit) {
				// Create Orbit Lines
				var resolution = 100;
				var amplitude = this.planet.distance;
				var size = 360 / resolution;

				var geometry = new THREE.Geometry();
				var material = new THREE.LineBasicMaterial( { color: this.orbitColor } );
				for(var i = 0; i <= resolution; i++) {
				    var segment = ( i * size ) * Math.PI / 180;
				    geometry.vertices.push( new THREE.Vector3( Math.cos( segment ) * amplitude, 0, Math.sin( segment ) * amplitude ) );         
				}

				var line = new THREE.Line( geometry, material );
				planetContainer.add(line);
				// Create Orbit Lines END
			}

			if(typeof this.planet.orbit == "object") {
				planetContainer.rotation.set(this.planet.orbit.rotation.x, this.planet.orbit.rotation.y, this.planet.orbit.rotation.z);
			}
		}

		if(typeof this.planet.moons == "object") {
			for(i in this.planet.moons) {
				this.planet.moonObjects[i] = new PlanetBody({x: 0, y: 0, z: 0}, this.planet.moons[i]);
				var moon = this.planet.moonObjects[i].createPlanet(true, 0x222222);
				planetObject.add(moon);
			}
		}

		return planetContainer;
	};

	this.updatePlanet = function() {
		var time = new Date();
		angle = time * this.planet.revolution * 0.000001;

		planetObject.position.set(this.planet.distance * Math.cos(angle), 0, this.planet.distance * Math.sin(angle));
		planetObject.rotation.y += this.planet.rotation / 10000;

		for(i in this.planet.moonObjects) {
			this.planet.moonObjects[i].updatePlanet();
		}
	};
}
PlanetBody.prototype = new Entity();






