"use strict";
/*jslint browser:true*/
/*global Movable, ctx*/

var Rope = function () {
    this.init(this, arguments);
};

(function () {
    var proto = Rope.prototype,
        MAX_POINTS = 7,// Points - 1 segments.
        stretch = 0.5,
        i,
        //colorLister = new ValueLister(ColorUtil.rgb(255, 5, 5), ColorUtil.rgb(200, 200, 0)),
        //SEG_DISTANCE = 5,
        colorLister = null,
        origin,
        onEach,
        line = {
            'width' : {
                'min' : 0,
                'max' : 3
            }
        };
    
    line.width.ratio = (line.width.max - line.width.min) / MAX_POINTS;
    
    onEach = function (callback, list) {
        var i;
        for (i = 0; i < list.length; i += 1) {
            callback(list[i], i);
        }
    };
    
    proto.init = function () {
        this.list = [];
        for (i = 0; i < MAX_POINTS; i += 1) {
            this.list.push(new Movable());
        }
        this.origin = this.list[0];
    };
    
    proto.render = function (ctx) {
        var instance = this,
            divisor = 1.8,
            xLast,
            yLast,
            useCurve = true,
            list = this.list;
        
		onEach(function (point, i) {
			if (i) {
                ///////////////
                //Integrating//
                ///////////////
				
                var dx = xLast - point.x(),
                    dy = yLast - point.y();
				//var d = Math.pow(dx, 2) + Math.pow(dy, 2);
				//d = Math.pow(d, 1/2);
				//if(d > SEG_DISTANCE)
				//{
				point.move(dx * stretch, dy * stretch);
				//}
			}
			point.integrate();
            
			/////////////
			//Rendering//
			/////////////
			if (i) {
				if (colorLister !== null) {
					ctx.strokeStyle = colorLister.get();
				}
                if(instance.color) {
                    ctx.strokeStyle = instance.color;
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

			xLast = point.x();
			yLast = point.y();
		}, this.list);
	};
    
    proto.setOrigin = function () {
        var item = this.list[0];
        item.place.apply(item, arguments);
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