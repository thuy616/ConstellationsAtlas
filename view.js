View = function(mode, data) {
	this.mode = mode;
	this.data = data;
	env = new Environment(this.data);
};

Initialize = function(mode, data) {
	this.mode = mode;
	this.data = data;
	var objectContainer = new THREE.Object3D();

	this.init = function() {
		switch(this.mode) {
			case 0: return this.Orbital();
			break;

			case 1: return this.System();
			break;

			case 2: return this.Galaxy();
			break;
		}
	};

	this.Orbital = function() {

	};

	this.System = function() {
		objectContainer.add(env.Skybox())
		objectContainer.add(env.StarDebris())
		objectContainer.add(env.SolarSystem())


		objectContainer.name = "Solar system";
		return objectContainer;
	};

	this.Galaxy = function() {
		
	};
};
Initialize.prototype = new View();

Update = function(mode, camera) {
	this.mode = mode;
	this.camera = camera;
	this.init = function() {
		switch(this.mode) {
			case 0: return this.Orbital();
			break;

			case 1: return this.System();
			break;

			case 2: return this.Galaxy();
			break;
		}
	};

	this.Orbital = function() {
		
	};

	this.System = function() {
		env.update(this.camera)
	};

	this.Galaxy = function() {
		
	};
};
Update.prototype = new View();


View.prototype.InitializeWorld = function() {
	var initialize = new Initialize(this.mode, this.data);
	return initialize.init();
};

View.prototype.UpdateWorld = function(camera) {
	var update = new Update(this.mode, camera);
	return update.init();
};