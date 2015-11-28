UI = function(data) {
	this.data = data;
	var speedEl = $('#currentSpeed');

	this.create = function() {
		$('.dial').trigger('configure', {'max' : this.data.ship.maxSpeed.toFixed(2) * 100 });
	};

	this.update = function(updateData) {
		this.data.velocity = updateData.velocity;
		this.updateSpeed();
	};

	this.updateSpeed = function() {
		speedEl.val(this.data.velocity.toFixed(2) * 100).trigger('change');
	}
};