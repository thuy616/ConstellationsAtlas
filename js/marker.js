/**
 * Created by thuynguyen on 09/10/15.
 */
var Markers = {
    projector: new THREE.Projector(),

    markers: [],
    addMarker: function(vector, name) {
        var l = {};

        var text = document.createElement('div');

        text.innerHTML = "<h3>"+name+"</h3>";

        l.text = text;
        l.v = vector;
        //l.toXYCoords(vector, camera);
        this.markers.push(l);

        document.getElementById("container").appendChild(l.text);
        return l.text;
    },

    toXYCoords: function(pos, camera) {
        var vector = pos.clone();
        this.projector.projectVector(vector, camera);
        vector.x =  (vector.x + 1)/2 * window.innerWidth;
        vector.y = -(vector.y - 1)/2 * window.innerHeight;
        return vector;
    }
};

