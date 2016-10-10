"use strict";
/*jslint browser:true, continue:true*/
/*global Vector, ctx*/

var Movable = function () {
	var instance = this,
        friction = 1,
        vectorNames = ['position', 'velocity', 'acceleration'],
        values = {},
        initVector,
        i;
    
	instance.set = {};
	instance.add = {};
	instance.mul = {};
    
    initVector = function (vectorName) {
		var vector = values[vectorName] = new Vector();

		instance.set[vectorName] = function () {
			vector.set.apply(null, arguments);
		};

		instance.add[vectorName] = function () {
			vector.add.apply(null, arguments);
		};

		instance.mul[vectorName] = function () {
			vector.mul.apply(null, arguments);
		};
	};

	for (i = 0; i < vectorNames.length; i += 1) {
		initVector(vectorNames[i]);
	}

	instance.move = function () {
		instance.set.position.apply(null, arguments);
	};

	instance.accelerate = function () {
		instance.set.acceleration.apply(null, arguments);
	};

	instance.velocity = function () {
		instance.set.velocity.apply(null, arguments);
	};

	instance.integrate = function () {
		instance.add.velocity(values.acceleration);
		instance.add.position(values.velocity);
		//TODO
		instance.mul.acceleration(friction, friction, friction);
	};

	instance.x = function () {
		return values.position.x();
	};

	instance.y = function () {
		return values.position.y();
	};

	instance.z = function () {
		return values.position.z();
	};

	///////////////
	// Execution //
	///////////////

	instance.move.apply(null, arguments);
};