"use strict";
/*jslint browser:true, continue:true*/
/*global Movable, toRad, ctx*/

var Bubble = function () {
	var radius,
        instance = this,
        origin = new Movable();
    
	instance.render = function (ctx) {
		ctx.beginPath();
		ctx.ellipse(origin.x(), origin.y(), radius, radius, toRad(45), 0, toRad(360));
		ctx.stroke();
	};

	instance.integrate = origin.integrate;
	instance.accelerate = origin.accelerate;
	instance.velocity = origin.velocity;
	instance.move = origin.move;

	instance.radius = function (r) {
		if (r) {
			radius = r;
		}
		return radius;
	};
};