var Vector = function () {
    var instance = this;
    var ax = Vector.axisFromArgs(arguments);
    
    instance.get = {
        "x": function () {
            return ax.x;
        }
        , "y": function () {
            return ax.y;
        }
        , "z": function () {
            return ax.z;
        }
    };

    instance.set = {
        "x": function (vx) {
            return ax.x = vx;
        }
        , "y": function (vy) {
            return ax.y = vy;
        }
        , "z": function (vz) {
            return ax.z = vz;
        }
    };
    
    instance.newVector = function(callback) {
        return new Vector(callback(ax.x), callback(ax.y), callback(ax.z));
    };
    
    instance.on = function(key, callback) {
        var value = ax[key];
        var result = callback(value, key);
        if(result != null) {
            ax[key] = result;
        }
    };
    
    instance.onEach = function(callback) {
        for(var key in ax) {
            instance.on(key, callback);
        }
    };
    
    instance.add = function () {
        var givenAx = Vector.axisFromArgs(arguments);
        if (!givenAx) {
            return;
        }
        
        instance.onEach(function(value, key) {
            var fn = instance.add[key];
            fn(givenAx[key]);
        });
    };
    
    instance.onEach(function(value, key) {
        instance.add[key] = function(v) {
            ax[key] += (v || 0);
        }
    });
    
    instance.toArray = function () {
        return [ax.x, ax.y, ax.z];
    };
    
    instance.toObject = function () {
        return {
            "x" : ax.x,
            "y" : ax.y,
            "z" : ax.z
        };
    };
};

Vector.axisFromArgs = function(args) {
    var x, y, z;
    if(!args || !args.length) {
        return null;
    }
    
    var vec = args[0];
    if(vec.constructor == Vector) {
        x = vec.get.x();
        y = vec.get.y();
        z = vec.get.z();
        
    } else {
        x = vec;
        y = args[1];
        z = args[2];
    }
    
    return {
        "x" : x,
        "y" : y,
        "z" : z
    };
};

var Velocity = function (x, y, z) {
    var instance = this;
    Vector.call(instance, x, y, z);
    
    instance.valueAfter = function(time) {
        return instance.newVector(function(v) {
            return v * t;
        });
    };
};

Velocity.prototype = Object.create(Vector.prototype);
Velocity.prototype.constructor = Velocity;

var Movable = function (options) {
    var instance = this;
    
    var position = options.position || new Vector();
    var velocity = options.velocity || new Velocity();
    var acceleration = options.acceleration || new Velocity();
    
    instance.updatePosition = function(time) {
        position.add(velocity.valueAfter(time));
    };
    
    instance.updateVelocity = function(time) {
        velocity.add(acceleration.valueAfter(time));
    };
};