(function () {
    "use strict";
    /*jslint browser:true*/
    /*global Movable, Color, Spring, ctx*/

    var Rope = function () {
        this.init.apply(this, arguments);
    },
        proto = Rope.prototype,
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
        var point,
            lastPoint,
            springLength,
            k;
        
        options = options || {};
        k = options.k || 0.9;
        springLength = options.springLength || 5;
        this.options = options;
        this.pointList = [];
        this.springList = [];
        
        for (i = 0; i < this.options.pointCount; i += 1) {
            point = new Movable();
            this.pointList.push(point);
            if (lastPoint) {
                this.springList.push(new Spring({
                    k : k,
                    p1 : lastPoint,
                    p2 : point,
                    length: springLength
                }));
            }
            lastPoint = point;
        }
        this.origin = this.pointList[0];
    };
    
    proto.render = function (ctx) {
        var instance = this,
            options = this.options,
            lastPos,
            xLast,
            yLast,
            useCurve = false,
            line = options.line,
            //TODO review line below.
            strokeStyle = instance.strokeStyle || options.strokeStyle,
            springList = this.springList,
            cp;
        
        this.pointList.forEach(function (point, i, pointList) {
			if (i) {
                ///////////////
                //Integrating//
                ///////////////
                var spring = springList[i - 1];
                spring.integrate();
			}
			point.integrate();
            
            /////////////
			//Rendering//
			/////////////
			if (i) {
                if (strokeStyle) {
                    if (strokeStyle.constructor === Color) {
                        ctx.strokeStyle = strokeStyle.hslaString();
                        
                    } else if (strokeStyle.constructor === Function) {
                        ctx.strokeStyle = strokeStyle();
                        
                    } else {
                        ctx.strokeStyle = strokeStyle;
                    }
                }
                
				ctx.lineWidth = line.width.min + (pointList.length - i) * line.width.ratio;
				ctx.beginPath();
				ctx.moveTo(xLast, yLast);
                
                if (useCurve) {
                    cp = {
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
		});
	};
    
    proto.setOrigin = function () {
        this.origin.place.apply(this.origin, arguments);
    };
    
    proto.place = function () {
		var arg = arguments;
		onEach(function (item, index) {
            item.place.apply(item, arg);
		}, this.pointList);
	};
    
    proto.move = function () {
        this.origin.move.apply(this.origin, arguments);
    };
    
    proto.accelerate = function () {
        this.origin.accelerate.apply(this.origin, arguments);
    };
    
    window.Rope = Rope;
}());