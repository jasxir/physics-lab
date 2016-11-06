(function () {
    "use strict";
    /*jslint browser:true*/
    /*global ColorUtil*/
    
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
    }, proto = Color.prototype;
    
    Color.hsla = function (h, s, l, a) {
        var color = new Color();
        color.set.hsla(h, s, l, a);
        return color;
    };
    
    proto.hueShift = function (amt) {
        return this.hue(this.hue() + amt);
    };
    
    proto.hue = function (amt) {
        if (amt !== undefined) {
            if (amt >= 360) {
                amt %= 360;
            }
            
            if (amt < 0) {
                amt = 0;
            }
            
            this.h = amt;
        }
        return this.h;
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
    
    proto.clone = function () {
        return Color.hsla(this.h, this.s, this.l, this.a);
    };
    
    proto.hslaString = function () {
        return ColorUtil.string.hsla(this.h, this.s, this.l, this.a);
    };
    
    proto.hslString = function () {
        return ColorUtil.string.hsl(this.h, this.s, this.l);
    };
    
    window.Color = Color;
}());