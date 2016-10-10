"use strict";
/*jslint browser:true, continue:true*/
/*global */

var RandomUtil = {
	'f' : function (min, max) {
		var range = max - min;
		return min + range * Math.random();
	},

	'i' : function (min, max) {
		var f = Math.ceil(RandomUtil.f(min - 1, max));
		return f;
	}
};