"use strict";
/*jslint browser:true, continue:true*/
/*global Vector, ctx*/

var Vector = function () {
	this.set.apply(this, arguments);
};

(function () {
    var proto = Vector.prototype,
        valueKeys = ['x', 'y', 'z'],
        onEach,
        objectAfter,
        toObject,
        vectorAfter,
        evaluate;
    
    onEach = function (callback, values) {
        var i,
            key,
            value,
            returnedValue;
        
		for (i = 0; i < valueKeys.length; i += 1) {
			key = valueKeys[i];
            if (values) {
                value = values[key];
            }
            returnedValue = callback(value, key, i);
			if (returnedValue !== undefined) {
                if (values) {
                    values[key] = returnedValue;
                }
			}
		}
	};

	objectAfter = function (callback, values) {
		var o = {};
		onEach(function (value, key, index) {
			o[key] = callback(value, key, index);
		}, values);
		return o;
	};
    
    vectorAfter = function (callback, values) {
		return new Vector(objectAfter(callback, values));
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

	evaluate = function (gValue, key, values) {
		if (gValue) {
            switch (gValue.constructor) {
            case Function:
                values[key] = evaluate(gValue(values[key]), key, values);
                break;
            case String:
                gValue = Number(gValue);
            case Number:
                values[key] = gValue;
            }
        }
		return values[key];
	};
    
    ////////////////////
    //Instance Methods//
    ////////////////////
    
    proto.val = function () {
		return objectAfter(function (value) {
			return value;
		}, this);
	};
    
	proto.mag = function () {
		var sum = 0;
		onEach(function (value) {
			sum += Math.pow(value, 2);
		}, this);
		return Math.sqrt(sum);
	};

	proto.set = function () {
        var map = toObject(arguments);
        onEach(function (value, key) {
            return map[key];
        }, this);
	};
    
	proto.cloneObject = function () {
		return objectAfter(function (value) {
			return value;
		}, this);
	};

	proto.clone = function () {
		return vectorAfter(function (value) {
			return value;
		});
	};

	proto.operation = function (fn, v) {
		onEach(function (value, key) {
			return fn(value, v[key]);
		}, this);
		return this;
	};
    
    proto.sub = function () {
		return this.operation(function (v1, v2) {
			return v1 - v2;
		}, toObject(arguments));
	};
	
    proto.add = function () {
		return this.operation(function (v1, v2) {
			return v1 + v2;
		}, toObject(arguments));
	};

	proto.mul = function () {
		return this.operation(function (v1, v2) {
			return v1 * v2;
		}, toObject(arguments));
	};
    
    proto.toString = function () {
        var v = this;
        return v.x + ', ' + v.y + ', ' + v.z;
    };
    
    proto.rotateXY = function (angleRad) {
		var v = this,
            xn = v.x * Math.cos(angleRad) - v.y * Math.sin(angleRad),
            yn = v.x * Math.sin(angleRad) + v.y * Math.cos(angleRad);
        v.x = xn;
        v.y = yn;
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
    
}());