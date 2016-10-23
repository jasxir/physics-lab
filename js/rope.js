"use strict";
/*jslint browser:true*/
/*global Movable, ctx*/

var Rope = function () {
    this.init.apply(this, arguments);
};

(function () {
    var proto = Rope.prototype,
        i,
        origin,
        onEach;
    
    onEach = function (callback, list) {
        var i;
        for (i = 0; i < list.length; i += 1) {
            callback(list[i], i);
        }
    };
    
    proto.init = function (options) {
        this.options = options;
        this.list = [];
        for (i = 0; i < this.options.pointCount; i += 1) {
            this.list.push(new Movable());
        }
        this.origin = this.list[0];
    };
    
    proto.render = function (ctx) {
        var instance = this,
            options = this.options,
            divisor = 1.8,
            lastPos,
            xLast,
            yLast,
            useCurve = true,
            stretch = options.stretch,
            line = options.line,
            segLength = options.segLength,
            strokeStyle = options.strokeStyle,
            list = this.list;
        
		onEach(function (point, i) {
			if (i) {
                ///////////////
                //Integrating//
                ///////////////
                var distance = lastPos.clone().sub(point.position);
                distance.setMag(distance.mag() - segLength);
                point.move(distance.x * stretch, distance.y * stretch);
			}
			point.integrate();
            
			/////////////
			//Rendering//
			/////////////
			if (i) {
                if (instance.strokeStyle) {
                    ctx.strokeStyle = instance.strokeStyle;
                    
                } else {
                    if (strokeStyle) {
                        if (strokeStyle.constructor === Function) {
                            ctx.strokeStyle = strokeStyle();
                        } else {
                            ctx.strokeStyle = strokeStyle;
                        }
                    }
                }
                
				ctx.lineWidth = line.width.min + (list.length - i) * line.width.ratio;
				ctx.beginPath();
				ctx.moveTo(xLast, yLast);
                
                if (useCurve) {
                    var cp = {
                        'x' : (xLast + point.x()) / 2,
                        'y' : (yLast + point.y()) / 2
                    };
                    ctx.quadraticCurveTo(cp.x, cp.y, point.x(), point.y());
                    
                } else {
                    ctx.lineTo(point.x(), point.y());
                }
				ctx.stroke();
			}

            lastPos = point.position;
			xLast = lastPos.x;
			yLast = lastPos.y;
		}, this.list);
	};
    
    proto.setOrigin = function () {
        this.origin.place.apply(this.origin, arguments);
    };
    
    proto.place = function () {
		var arg = arguments;
		onEach(function (item, index) {
            item.place.apply(item, arg);
		}, this.list);
	};
    
    proto.move = function () {
        this.origin.move.apply(this.origin, arguments);
    };
    
    proto.accelerate = function () {
        this.origin.accelerate.apply(this.origin, arguments);
    };
}());