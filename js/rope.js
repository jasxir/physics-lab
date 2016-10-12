"use strict";
/*jslint browser:true*/
/*global Movable, ctx*/


var Rope = function () {
	var instance = this,
        MAX_POINTS = 10,// Points - 1 segments.
        stretch = 0.4,
        line = {
            'width' : {
                'min' : 0,
                'max' : 3
            }
        },
        list = [],
        i,
        //colorLister = new ValueLister(ColorUtil.rgb(255, 5, 5), ColorUtil.rgb(200, 200, 0)),
        colorLister = null,
        origin,
        onEach;
    
	//var SEG_DISTANCE = 5;
    
	line.width.ratio = (line.width.max - line.width.min) / MAX_POINTS;
	
	//var colorLister = new ValueLister(ColorUtil.rgb(255, 5, 5), ColorUtil.rgb(200, 200, 0));

	for (i = 0; i < MAX_POINTS; i += 1) {
		list.push(new Movable());
	}

	origin = list[0];

	onEach = function (callback) {
        var i;
		for (i = 0; i < list.length; i += 1) {
			callback(list[i], i);
		}
	};

	instance.render = function (ctx) {
		var divisor = 1.8,
            xLast,
            yLast,
            useCurve = true;
        
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
				ctx.lineWidth = line.width.min + (list.length - i) * line.width.ratio;
				ctx.beginPath();
				ctx.moveTo(xLast, yLast);
                
                if(useCurve) {
                    var cp = {
                        'x' : (xLast + point.x())/2,
                        'y' : (yLast + point.y())/2
                    };
                    ctx.quadraticCurveTo(cp.x, cp.y, point.x(), point.y());
                    
                } else {
                    ctx.lineTo(point.x(), point.y());
                }
				ctx.stroke();
			}

			xLast = point.x();
			yLast = point.y();
		});
	};
    
	instance.place = function () {
		var arg = arguments;
		onEach(function (item) {
			item.place.apply(item, arg);
		});
	};
    
    instance.move = function () {
        origin.move.apply(origin, arguments);
    };
    
    instance.accelerate = function () {
        origin.accelerate.apply(origin, arguments);
    };
    
    instance.x = origin.x;
	instance.y = origin.y;
};