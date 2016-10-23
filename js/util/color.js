"use strict";
/*jslint browser:true, continue:true*/
/*global ColorUtil, RandomUtil */

var Color = function () {
	var instance = this;
    
    instance.set = {
        'hsla' : function (h, s, l, a) {
            instance.h = h;
            instance.s = s;
            instance.l = l;
            instance.a = a;
            //ColorUtil.calculate.RGB(instance);
        },
        
        'rgba' : function (r, g, b, a) {
            instance.r = r;
            instance.g = g;
            instance.b = b;
            instance.a = a;
            ColorUtil.calculate.HSL(instance);
        }
    };
};

(function () {
    var proto = Color.prototype;
    
    Color.hsla = function(h, s, l, a) {
        var color = new Color();
        color.set.hsla(h, s, l, a);
        return color;
    };
    
    proto.fade = function (amt) {
        var c = this;
        if (c.a === 0) {
            return false;
        }
        
        c.a -= amt;
		if (c.a < 0) {
			c.a = 0;
            return false;
            
		} else {
            return true;
        }
    };
    
    proto.darken = function (amt) {
        var c = this;
        if (c.l === 0) {
            return false;
        }
        
		c.l -= amt;
		if (c.l < 0) {
			c.l = 0;
            return false;
            
		} else {
            return true;
        }
	};
    
    proto.hslaString = function() {
        return ColorUtil.string.hsla(this.h, this.s, this.l, this.a);
    };
    
    proto.hslString = function() {
        return ColorUtil.string.hsl(this.h, this.s, this.l);
    };
    
}());