/**
 * Created by thuynguyen on 05/10/15.
 */


function drawConstellations(scene, scaleFactor, constellationSource) {
    var mat = new THREE.LineBasicMaterial({
        color: '#ffffff',
        size: 10
    });

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            var data = JSON.parse(httpRequest.responseText);
            data.forEach(function (c) {
                //
                var constellations = c.stars;
                var pos = new THREE.Vector3(
                    data[0][0].x * scaleFactor,
                    data[0][0].y * scaleFactor,
                    data[0][0].z * scaleFactor);

                var name = c.abbr;
                if (c.hasOwnProperty('name')) {
                    name = c.name;
                }

                constellations.forEach(function (stars) {
                    var geometry = new THREE.Geometry();
                    stars.forEach(function (star) {
                        geometry.vertices.push(
                            new THREE.Vector3(
                                star.x * scaleFactor,
                                star.y * scaleFactor,
                                star.z * scaleFactor));

                    });
                    var line = new THREE.Line(geometry, mat);
                    scene.add(line);
                });
            });
        }
    }

    httpRequest.open("GET", constellationSource);
    httpRequest.send();
}

