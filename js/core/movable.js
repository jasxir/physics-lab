"use strict";
/*jslint browser:true*/
/*global Vector, ctx*/

var Movable = function () {
    this.init.apply(this, arguments);
};

(function () {
    var vectorNames = ['position', 'velocity', 'acceleration'],
        methodNames = ['set', 'add', 'mul'],
        proto = Movable.prototype,
        friction = 1,
        onVectorNames,
        i;
    
    onVectorNames = function (callback) {
        var i;
        for (i = 0; i < vectorNames.length; i += 1) {
            callback(vectorNames[i], i);
        }
    };
    
    proto.init = function () {
        var v = this.values = {};
        onVectorNames(function (name) {
            v[name] = new Vector();
        });
        this.place.apply(this, arguments);
    };
    
    proto.integrate = function () {
        var values = this.values;
        values.velocity.add(values.acceleration);
        values.position.add(values.velocity);
        values.acceleration.mul(friction, friction, friction);
	};
    
	proto.place = function () {
        var position = this.values.position;
        position.set.apply(position, arguments);
	};
    
    proto.move = function () {
        var velocity = this.values.velocity;
        velocity.set.apply(velocity, arguments);
	};
    
    proto.accelerate = function () {
		var acceleration = this.values.acceleration;
        acceleration.set.apply(acceleration, arguments);
	};
    
    proto.x = function () {
        return this.values.position.x;
    };
    
    proto.y = function () {
        return this.values.position.y;
    };
    
    proto.z = function () {
        return this.values.position.z;
    };
    
    proto.toString = function () {
        return this.values.position.toString();
    };
    
}());