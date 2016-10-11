"use strict";
/*jslint browser:true*/
/*global Vector, ctx*/

var Movable = function () {
	var values = {};
    this.init(values);
	this.place.apply(this, arguments);
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
    
    proto.init = function (values) {
        this._values = values;
        onVectorNames(function (name) {
            values[name] = new Vector();
        });
    };
    
    /*
    proto.operation = function(vectorName, methodName, v) {
        var vector = this._values[vectorName];
        var fn = vector[methodName];
        return fn(v);
    };
    
    initVector = function (map, methodName, vectorName) {
        map[vectorName] = function (v) {
            return proto.operation.call(this, vectorName, methodName, v);
        };
    };
    
    for (i = 0; i < methodNames.length; i += 1) {
        var methodName = methodNames[i];
        var map = proto[methodName] = {};
        onVectorNames(function(vectorName) {
            initVector(map, methodName, vectorName);
        });
    }*/
    
    proto.integrate = function () {
        var values = this._values;
        values.velocity.add.call(this, values.acceleration);
        values.position.add.call(this, values.velocity);
        values.acceleration.mul.apply(this, [friction, friction, friction]);
	};
    
	proto.place = function () {
        this._values.position.set.apply(this, arguments);
	};
    
    proto.move = function () {
		this._values.velocity.set.apply(this, arguments);
	};
    
    proto.accelerate = function () {
		this._values.acceleration.set.apply(this, arguments);
	};
    
    proto.x = function () {
        return this._values.position.x();
    };
    
    proto.y = function() {
        return this._values.position.y();
    };
    
    proto.z = function() {
        return this._values.position.z();
    };
    
    proto.toString = function() {
        return this.x() + ', ' + this.y() + ', ' + this.z();
    };
    
}());