"use strict";
/*jslint browser:true, continue:true*/
/*global Vector, ctx*/

var Vector = function () {
	var instance = this,
        valueKeys = ['x', 'y', 'z'],
        values = {},
        onEach,
        objectAfter,
        toObject,
        vectorAfter,
        evaluate;
    
	onEach = function (callback) {
        var i,
            key,
            value,
            returnedValue;
        
		for (i = 0; i < valueKeys.length; i += 1) {
			key = valueKeys[i];
			value = values[key];
            returnedValue = callback(value, key, i);
			if (returnedValue !== undefined) {
				values[key] = returnedValue;
			}
		}
	};

	objectAfter = function (callback) {
		var o = {};
		onEach(function (value, key, index) {
			o[key] = callback(value, key, index);
		});
		return o;
	};

	toObject = function (arg, index) {
		if (!index) {
			index = 0;
		}

		if (arg.length  ===  0) {
			return objectAfter(function (value, key, i) {
				return 0;
			});
		}

		var o = arg[index], con;

		if (o === undefined || o === null) {
			o = 0;
		}
        
        con = o.constructor;
        switch (con) {
        case Object:
            return o;
            
        case Vector:
            return o.cloneObject();
        
        case Number:
        case Array:
            return objectAfter(function (value, key, i) {
                return ((con === Array) ? o[i] : arg[index + i]) || 0;
            });
		}
	};

	vectorAfter = function (callback) {
		return new Vector(objectAfter(callback));
	};

	evaluate = function (gValue, key) {
		if (gValue) {
            switch (gValue.constructor) {
            case Function:
                values[key] = evaluate(gValue(values[key]), key);
                break;
            case String:
                gValue = Number(gValue);
            case Number:
                values[key] = gValue;
            }
        }
		return values[key];
	};

	instance.val = function () {
		return objectAfter(function (value) {
			return value;
		});
	};

	instance.mag = function () {
		var sum = 0;
		onEach(function (value) {
			sum += Math.pow(value, 2);
		});
		return Math.sqrt(sum);
	};

	instance.set = function () {
		values = toObject(arguments);
	};

	instance.rotateXY = function (angleRad) {
		var xn = values.x * Math.cos(angleRad) - values.y * Math.sin(angleRad),
            yn = values.x * Math.sin(angleRad) + values.y * Math.cos(angleRad);
        values.x = xn;
        values.y = yn;
	};

	/*
	instance.setMagAngle = function (mag, angle) {
		onEach(function (value, key) {
			return (key  ==  'x') ? mag : 0;
		});
		instance.rotateXY(angle);
	};*/
	
	instance.cloneObject = function () {
		return objectAfter(function (value) {
			return value;
		});
	};

	instance.clone = function () {
		return vectorAfter(function (value) {
			return value;
		});
	};

	instance.operation = function (fn, v) {
		onEach(function (value, key) {
			return fn(value, v[key]);
		});
		return instance;
	};

	instance.add = function () {
		return instance.operation(function (v1, v2) {
			return v1 + v2;
		}, toObject(arguments));
	};

	instance.mul = function () {
		return instance.operation(function (v1, v2) {
			return v1 * v2;
		}, toObject(arguments));
	};

	///////////////
	// Execution //
	///////////////

	instance.set.apply(instance, arguments);

	onEach(function (value, key, index) {
		instance[key] = function (gValue) {
			return evaluate(gValue, key);
		};
	});
};

Vector.xyzFromMagAngle = function (m, angleRad) {
	var x = m * Math.cos(angleRad),
        y = m * Math.sin(angleRad);
    return {
        'x' : x,
        'y' : y,
        'z' : 0
    };
};