"use strict";
/*jslint browser:true, continue:true*/
/*global Color, ColorUtil, Movable, RandomUtil, Rope, Vector, height, toRad*/

var FireWork = function (x, y) {
    this.init.apply(this, arguments);
};

(function () {
    var proto = FireWork.prototype,
        MAX_STRANDS = 9,
        angle = {
            'mid' : 270,
            'spread' : 100
        };
    
    angle.min = angle.mid - angle.spread / 2;
    angle.max = angle.mid + angle.spread / 2;
    
    //TODO use general arguments.
    proto.init = function (x, y) {
        var rope,
            i,
            rad,
            mag;
        
        this.list = [];
        this.color = new Color();
        this.color.set.hsl(RandomUtil.i(0, 360), 100, 50, 1);
        this.origin = new Movable(x, y);
        this.done = false;
        
        for (i = 0; i < MAX_STRANDS; i += 1) {
            rope = new Rope();
            rad = toRad(RandomUtil.i(angle.min, angle.max));
            mag = RandomUtil.i(6, 9);
            
            rope.place(this.origin.x(), this.origin.y());
            rope.move(Vector.xyzFromMagAngle(mag, rad));
            rope.accelerate(0, 0.2);
            this.list.push(rope);
        }
    };
    
    proto.render = function (ctx) {
		var i,
            item,
            darkened;
        
        if (this.done) {
			return;
		}
        darkened = ColorUtil.fade(this.color, 0.013);
        if (!darkened) {
            this.done = true;
            return;
        }
        
		ctx.strokeStyle = ColorUtil.string.hsla(this.color);
		for (i = 0; i < this.list.length; i += 1) {
			item = this.list[i];
			item.render(ctx);
		}
	};
    
}());