"use strict";
/*jslint browser:true*/
/*global Movable, toRad, ctx*/

var Bubble = function () {
	var radius,
        instance = this,
        origin = new Movable();
    
	instance.render = function (ctx) {    
        origin.integrate.apply(origin);        
        ctx.strokeStyle = "#FF0011";
		ctx.beginPath();
		ctx.ellipse(origin.x(), origin.y(), radius, radius, Math.toRad(45), 0, Math.toRad(360));
		ctx.stroke();
	};
    
    instance.place = function() {
        origin.place.apply(origin, arguments);
    };
    
    instance.move = function() {
        origin.move.apply(origin, arguments);
    };
    
    instance.accelerate = function() {
        origin.accelerate.apply(origin, arguments);
    };
    
    instance.radius = function (r) {
		if (r) {
			radius = r;
		}
		return radius;
	};
};