"use strict";
/*jslint browser:true, continue:true*/
/*global ColorUtil*/

var Color = function () {
	var instance = this;
    
    instance.set = {
        'hsl' : function (h, s, l, a) {
            instance.h = h;
            instance.s = s;
            instance.l = l;
            instance.a = a;
            //ColorUtil.calculate.RGB(instance);
        },
        
        'rgb' : function (r, g, b, a) {
            instance.r = r;
            instance.g = g;
            instance.b = b;
            instance.a = a;
            ColorUtil.calculate.HSL(instance);
        }
    };
};