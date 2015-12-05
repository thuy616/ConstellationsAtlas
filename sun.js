var sunTexture;
var sunColorLookupTexture;
var solarflareTexture;
var sunHaloTexture;
var sunHaloColorTexture;
var sunCoronaTexture;
var starColorGraph = THREE.ImageUtils.loadTexture( 'images/star_color_modified.png' );
var glowSpanTexture = THREE.ImageUtils.loadTexture('images/glowspan.png');

var shaderList;

function loadStarSurfaceTextures(){
	if( sunTexture === undefined ){
		sunTexture = THREE.ImageUtils.loadTexture( "images/sun_surface.png");
		sunTexture.anisotropy = 1;
		sunTexture.wrapS = sunTexture.wrapT = THREE.RepeatWrapping;
	}

	if( sunColorLookupTexture === undefined ){
		sunColorLookupTexture = THREE.ImageUtils.loadTexture( "images/star_colorshift.png" );
	}

	if( solarflareTexture === undefined ){
		solarflareTexture = THREE.ImageUtils.loadTexture( "images/solarflare.png" );
	}

	if( sunHaloTexture === undefined ){
		sunHaloTexture = THREE.ImageUtils.loadTexture( "images/sun_halo.png");
	}

	if( sunHaloColorTexture === undefined ){
		sunHaloColorTexture = THREE.ImageUtils.loadTexture( "images/halo_colorshift.png" );
	}

	if( sunCoronaTexture === undefined ){
		sunCoronaTexture = THREE.ImageUtils.loadTexture( "images/corona.png");
	}
}

var surfaceGeo = new THREE.SphereGeometry( 7.35144, 60, 30);
function makeStarSurface( radius, uniforms ){
	var sunShaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		uniforms,
		vertexShader:   shaderList.starsurface.vertex,
		fragmentShader: shaderList.starsurface.fragment,
	});

	var sunSphere = new THREE.Mesh( surfaceGeo, sunShaderMaterial);
	return sunSphere;
}

var haloGeo = new THREE.PlaneGeometry( .00000022 * 10e7, .00000022 * 10e7 );
function makeStarHalo(uniforms){
	var sunHaloMaterial = new THREE.ShaderMaterial(
		{
			uniforms: 		uniforms,
			vertexShader:   shaderList.starhalo.vertex,
			fragmentShader: shaderList.starhalo.fragment,
			blending: THREE.AdditiveBlending,
			depthTest: 		false,
			depthWrite: 	false,
			color: 0xffffff,
			transparent: true,
			//	settings that prevent z fighting
			polygonOffset: true,
			polygonOffsetFactor: 1,
			polygonOffsetUnits: 100,
		}
	);

	var sunHalo = new THREE.Mesh( haloGeo, sunHaloMaterial );
	sunHalo.position.set( 0, 0, 0 );
	return sunHalo;
}

var glowGeo = new THREE.PlaneGeometry( .0000012 * 10e7, .0000012 * 10e7 );
function makeStarGlow(uniforms){
	//	the bright glow surrounding everything
	var sunGlowMaterial = new THREE.ShaderMaterial(
		{
			//map: sunCoronaTexture,
			uniforms: 		uniforms,
			blending: THREE.AdditiveBlending,
			fragmentShader: shaderList.corona.fragment,
			vertexShader:   shaderList.corona.vertex,
			color: 0xffffff,
			transparent: true,
			//	settings that prevent z fighting
			polygonOffset: true,
			polygonOffsetFactor: -1,
			polygonOffsetUnits: 100,
			depthTest: true,
			depthWrite: true,
		}
	);

	var sunGlow = new THREE.Mesh( glowGeo, sunGlowMaterial );
	sunGlow.position.set( 0, 0, 0 );
	return sunGlow;
}

function makeStarLensflare(size, zextra, hueShift){
	var sunLensFlare = addStarLensFlare( 0,0,zextra, size, undefined, hueShift);
	sunLensFlare.customUpdateCallback = function(object){
		if( object.visible == false )
			return;
	    var f, fl = this.lensFlares.length;
	    var flare;
	    var vecX = -this.positionScreen.x * 2;
	    var vecY = -this.positionScreen.y * 2;
	    var size = object.size ? object.size : 16000;

	    var camDistance = camera.position.length();

	    for( f = 0; f < fl; f ++ ) {

	        flare = this.lensFlares[ f ];

	        flare.x = this.positionScreen.x + vecX * flare.distance;
	        flare.y = this.positionScreen.y + vecY * flare.distance;

			flare.scale = size / Math.pow(camDistance,2.0) * 2.0;

	        if( camDistance < 1000.0 ){
	        	flare.opacity = Math.pow(camDistance * 2.0,2.0);
	        }
	        else{
	        	flare.opacity = 1.0;
	        }

	        flare.rotation = 0;


			//flare.rotation = this.positionScreen.x * 0.5;
	        //flare.rotation = 0;
	    }

	    for( f=2; f<fl; f++ ){
	    	flare = this.lensFlares[ f ];
	    	var dist = Math.sqrt( Math.pow(flare.x,2) + Math.pow(flare.y,2) );
	    	flare.opacity = constrain( dist, 0.0, 1.0 );
	    	flare.wantedRotation = flare.x * Math.PI * 0.25;
        	flare.rotation += ( flare.wantedRotation - flare.rotation ) * 0.25;
	    }
	    
	    // console.log(camDistance);
	};
	return sunLensFlare;
}

var solarflareGeometry = new THREE.TorusGeometry( 0.00000003 * 10e8, 0.000000001 + 0.000000002, 60, 90, 0.15 + Math.PI  );
function makeSolarflare( uniforms ){
	var solarflareMaterial = new THREE.ShaderMaterial(
		{
			uniforms: 		uniforms,
			vertexShader:   shaderList.starflare.vertex,
			fragmentShader: shaderList.starflare.fragment,
			blending: THREE.AdditiveBlending,
			color: 0xffffff,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: -100,
			polygonOffsetUnits: 1000,
		}
	);

	var solarflareMesh = new THREE.Object3D();

	for( var i=0; i< 6; i++ ){
		var solarflare = new THREE.Mesh(solarflareGeometry, solarflareMaterial );
		solarflare.rotation.y = Math.PI/2;
		solarflare.speed = Math.random() * 0.01 + 0.005;
		solarflare.rotation.z = Math.PI * Math.random() * 2;
		solarflare.rotation.x = -Math.PI + Math.PI * 2;
		solarflare.update = function(){
			this.rotation.z += this.speed;
		}
		var solarflareContainer = new THREE.Object3D();
		solarflareContainer.position.x = -1 + Math.random() * 2;
		solarflareContainer.position.y = -1 + Math.random() * 2;
		solarflareContainer.position.z = -1 + Math.random() * 2;
		solarflareContainer.position.multiplyScalar( 7.35144 * 0.8 );
		solarflareContainer.lookAt( new THREE.Vector3(0,0,0) );
		solarflareContainer.add( solarflare );

		solarflareMesh.add( solarflareContainer );
	}

	return solarflareMesh;
}

function makeSun( radius, spectral, inShaderList){
	
	shaderList = inShaderList;

  // console.time("load sun textures"); 
	loadStarSurfaceTextures();
  // console.timeEnd("load sun textures");

	var sunUniforms = {
		texturePrimary:   { type: "t", value: sunTexture },
		textureColor:   { type: "t", value: sunColorLookupTexture },
		textureSpectral: { type: "t", value: starColorGraph },
		time: 			{ type: "f", value: 0 },
		spectralLookup: { type: "f", value: 0 },		
	};

	var solarflareUniforms = {
		texturePrimary:   { type: "t", value: solarflareTexture },
		time: 			{ type: "f", value: 0 },
		textureSpectral: { type: "t", value: starColorGraph },
		spectralLookup: { type: "f", value: 0 },	
	};

	var haloUniforms = {
		texturePrimary:   { type: "t", value: sunHaloTexture },
		textureColor:   { type: "t", value: sunHaloColorTexture },
		time: 			{ type: "f", value: 0 },
		textureSpectral: { type: "t", value: starColorGraph },
		spectralLookup: { type: "f", value: 0 },			
	};

	var coronaUniforms = {
		texturePrimary:   { type: "t", value: sunCoronaTexture },
		textureSpectral: { type: "t", value: starColorGraph },
		spectralLookup: { type: "f", value: 0 },			
	};	

	//	container
	var sun = new THREE.Object3D();


	// point light!
	//var light = new THREE.PointLight(0xffffff, 1, 200);
	//sun.add(light);

	//	the actual glowy ball of fire
  // console.time("make sun surface");
	var starSurface = makeStarSurface( radius, sunUniforms );
	sun.add( starSurface );
  // console.timeEnd("make sun surface");

  // console.time("make sun solarflare");
	// var solarflare = makeSolarflare( solarflareUniforms );
	// sun.solarflare = solarflare;
	// sun.add( solarflare );	
  // console.timeEnd("make sun solarflare");

	//	2D overlay elements	
	//var gyro = new THREE.Gyroscope();

	//sun.add( gyro );	
	//	sun.gyro = gyro;

    // console.time("make sun lensflare");
		// var starLensflare = makeStarLensflare(100, 10, spectral);
		// sun.lensflare = starLensflare;
		// sun.lensflare.name == 'lensflare';
	//	gyro.add( starLensflare );
    // console.timeEnd("make sun lensflare");

		//	the corona that lines the edge of the sun sphere
    // console.time("make sun halo");
		// var starHalo = makeStarHalo( haloUniforms );
	//	gyro.add( starHalo );
    // console.timeEnd("make sun halo");
	
    // console.time("make sun glow");
		// var starGlow = makeStarGlow( coronaUniforms );
	//	gyro.add( starGlow );
    // console.timeEnd("make sun glow");

    //updateGyro();

	// var latticeMaterial = new THREE.MeshBasicMaterial({
	// 	map: glowSpanTexture,
	// 	blending: THREE.AdditiveBlending,
	// 	transparent: true,
	// 	depthTest: true,
	// 	depthWrite: true,		
	// 	wireframe: false,
	// 	opacity: 0.8,
	// });

	// var lattice = new THREE.Mesh( new THREE.IcosahedronGeometry( 7.35144, 2), latticeMaterial );
	// lattice.update = function(){
	// 	this.rotation.y += 0.001;
	// 	this.rotation.z -= 0.0009;
	// 	this.rotation.x -= 0.0004;
	// }
	// lattice.material.map.wrapS = THREE.RepeatWrapping;
	// lattice.material.map.wrapT = THREE.RepeatWrapping;
	// lattice.material.map.needsUpdate = true;
	// lattice.material.map.onUpdate = function(){
	// 	this.offset.y -= 0.01;
	// 	this.needsUpdate = true;
	// }

	// sun.add(lattice);

	sun.sunUniforms = sunUniforms;
	sun.solarflareUniforms = solarflareUniforms;
	sun.haloUniforms = haloUniforms;
	sun.coronaUniforms = coronaUniforms;

	sun.rotation.z = -0.93;
	sun.rotation.y = 0.2;

	sun.setSpectralIndex = function( index ){
		var starColor = map( index, -0.3, 1.52, 0, 1);
		starColor = constrain( starColor, 0.0, 1.0 );
		this.starColor = starColor;

		this.sunUniforms.spectralLookup.value = starColor;
		this.solarflareUniforms.spectralLookup.value = starColor;
		this.haloUniforms.spectralLookup.value = starColor;		
		this.coronaUniforms.spectralLookup.value = starColor;	
	}

	sun.setScale = function( index ){
		this.scale.setLength( index );
		
		//	remove old lensflare
		//this.gyro.remove( this.lensflare );

		// var lensflareSize = 4.0 + index * 0.5 + 0.1 * Math.pow(index,2);
		// if( lensflareSize < 1.5 )
		// 	lensflareSize = 1.5;
		// this.lensflare = makeStarLensflare( lensflareSize, 0.0002 * index, this.starColor );		
		// this.lensflare.name = 'lensflare';
		//this.gyro.add( this.lensflare );	
	}

	sun.randomizeSolarFlare = function(){
		this.solarflare.rotation.x = Math.random() * Math.PI * 2;
		this.solarflare.rotation.y = Math.random() * Math.PI * 2;
	}

	sun.setSpectralIndex( spectral );

	// sun.update = function(camera){
	// 	this.camera = camera;
	// 	this.sunUniforms.time.value = shaderTiming;
	// 	this.haloUniforms.time.value = shaderTiming;
	// 	this.solarflareUniforms.time.value = shaderTiming;
		
	// // 	// if( this.gyro.getObjectByName('lensflare') === undefined ){
	// // 	// 	this.gyro.add( this.lensflare );			
	// }

	// 	// this.gyro.lookAt(this.camera.position);
	// }

	return sun;
}

function random(low, high) {
  if (low >= high) return low;
  var diff = high - low;
  return (Math.random() * diff) + low;
}

function map( value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function constrain(v, min, max){
  if( v < min )
    v = min;
  else
  if( v > max )
    v = max;
  return v;
}
