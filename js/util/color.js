"use strict";
/*jslint browser:true, continue:true*/
/*global ColorUtil*/

var Color = function () {
	var instance = this;
    
    instance.set = {
        'hsl' : function (h, s, l) {
            instance.h = h;
            instance.s = s;
            instance.l = l;
            //ColorUtil.calculate.RGB(instance);
        },
        
        'rgb' : function (r, g, b) {
            instance.r = r;
            instance.g = g;
            instance.b = b;
            ColorUtil.calculate.HSL(instance);
        }
    };
};