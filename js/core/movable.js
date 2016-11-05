(function () {
    "use strict";
    /*jslint browser:true*/
    /*global Vector, ctx*/

    var Movable = function () {
        this.init.apply(this, arguments);
    },
        proto = Movable.prototype,
        vectorNames = ['position', 'velocity', 'acceleration'],
        methodNames = ['set', 'add', 'mul'],
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
        var v = this;
        onVectorNames(function (name) {
            v[name] = new Vector();
        });
        this.place.apply(this, arguments);
    };
    
    proto.integrate = function () {
        var v = this;
        v.velocity.add(v.acceleration);
        v.position.add(v.velocity);
        v.acceleration.mul(friction, friction, friction);
	};
    
	proto.place = function () {
        var position = this.position;
        position.set.apply(position, arguments);
	};
    
    proto.move = function () {
        var velocity = this.velocity;
        velocity.set.apply(velocity, arguments);
	};
    
    proto.accelerate = function () {
		var acceleration = this.acceleration;
        acceleration.set.apply(acceleration, arguments);
	};
    
    proto.x = function () {
        return this.position.x;
    };
    
    proto.y = function () {
        return this.position.y;
    };
    
    proto.z = function () {
        return this.position.z;
    };
    
    proto.toString = function () {
        return this.position.toString();
    };
    
    window.Movable = Movable;
}());