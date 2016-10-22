"use strict";
/*jslint browser:true, continue:true*/
/*global RandomUtil, Color*/

var ColorUtil = {
	'string' : {
		'rgba' : function (r, g, b, a) {
			return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
		},

		'rgb' : function (r, g, b) {
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		},

		'hsl' : function (h, s, l) {
            if (s === undefined) {
                s = h.s;
                l = h.l;
                h = h.h;
            }
			return 'hsl(' + h + ',' + s + '%,' + l + '%)';
		},

		'hsla' : function (h, s, l, a) {
            if (s === undefined) {
                s = h.s;
                l = h.l;
                a = h.a;
                h = h.h;
            }
			return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
		}
	},
    
	'toHSL' : function (r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
        
		var h, s, l,
            min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            d = max - min;
        
		l = (max + min) / 2;

		if (d === 0) {
			h = 0;
			s = 0;

		} else {
			if (l < 0.5) {
				s = d / (max + min);
			} else {
				s = d / (2 - max - min);
			}

			if (r === max) {
				h = (g - b) / d;

			} else if (g === max) {
				h = 2 + (b - r) / d;

			} else if (b === max) {
				h = 4 + (r - g) / d;
			}

			h *= 60;

			if (h < 0) {
				h += 360;
			}
		}

		s *= 100;
		l *= 100;

		return {
			'h' : h,
			's' : s,
			'l' : l
		};
	},

	'random' : function (min) {
		return new Color(
			ColorUtil.randomElement(min),
			ColorUtil.randomElement(min),
			ColorUtil.randomElement(min)
		);
	},

	'randomElement' : function (min) {
		return RandomUtil.i(min, 255);
	},
    
    'calculate' : {
        'HSL' : function (c) {
            var hsl = ColorUtil.toHSL(c.r, c.g, c.b);
            c.set.hsl(hsl.h, hsl.s, hsl.l);
        }
    },
    
    'darken' : function (c, amt) {
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
	},
    
    'fade' : function (c, amt) {
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
    }
};