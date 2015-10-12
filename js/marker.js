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
        //l.text.style.top = vector.y + 'px';
        //l.text.style.left = vector.x + 'px' ;
        //l.text.style.zIndex = vector.z;

        this.markers.push(l);

        document.getElementById("container").appendChild(l.text);
        //to2DPlane(l, vector, camera);
        return l.text;
    },

    toXYCoords: function(pos, camera) {
        var vector = pos.clone();
        vector.project(camera);
        // map to 2D screen space
        vector.x = Math.round( (   vector.x + 1 ) * window.innerWidth  / 2 );
        vector.y = Math.round( ( - vector.y + 1 ) * window.innerHeight / 2 );
        return vector;
    },


    update: function(camera){

        for (var i=0; i<this.markers.length; i++) {
            var item = this.markers[i];
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
};

var to2DPlane = function(marker, v3, camera) {
    var vector = v3.clone();
    vector.project(camera);
    // map to 2D screen space
    vector.x = Math.round( (   vector.x + 1 ) * window.innerWidth  / 2 );
    vector.y = Math.round( ( - vector.y + 1 ) * window.innerHeight / 2 );
    marker.text.style.top  = vector.y + 'px';
    marker.text.style.left = vector.x + 'px';
    if(vector.z > 1.0){
        marker.text.style.display = 'none';
    } else {
        marker.text.style.display = 'inline-block';
    }
};

