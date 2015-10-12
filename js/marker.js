/**
 * Created by thuynguyen on 09/10/15.
 */
var Markers = {
    projector: new THREE.Projector(),

    markers: [],
    addMarker: function(vector, name, camera) {
        var l = {};

        var text = document.createElement('div');
        text.className = "marker";
        var t = document.createTextNode(name);
        var p = document.createElement('p');
        p.appendChild(t);
        text.appendChild(p);

        l.text = text;
        l.v = vector;

        this.markers.push(l);

        document.getElementById("container").appendChild(l.text);
        //to2DPlane(l, vector, camera);
        return l.text;
    }

};

var toXYCoords = function(pos, camera) {
    var vector = pos.clone();
    vector.project(camera);
    // map to 2D screen space
    vector.x = Math.round( (   vector.x + 1 ) * window.innerWidth  / 2 );
    vector.y = Math.round( ( - vector.y + 1 ) * window.innerHeight / 2 );
    return vector;
};

var updateMarkers = function(markers, camera){

    for (var i=0; i<markers.length; i++) {
        var item = markers[i];
        var newPos = this.toXYCoords(item.v, camera);
        item.text.style.top  = newPos.y + 'px';
        item.text.style.left = newPos.x + 'px';
        if(newPos.z > 1.0){
            item.text.style.display = 'none';
        } else {
            item.text.style.display = 'inline-block';
        }
    }
}



