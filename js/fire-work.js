"use strict";
/*jslint browser:true, continue:true*/
/*global Color, ColorUtil, Movable, RandomUtil, Rope, Vector, height, toRad*/

var FireWork = function (x, y) {
	var instance = this,
        MAX_STRANDS = 15,
        list = [],
        origin = new Movable(x, y),
        color = new Color(),
        i,
        angle = {
            'mid' : 270,
            'spread' : 100
        },
        rope,
        rad,
        mag;
    
    color.set.hsl(RandomUtil.i(0, 360), 100, 50);
    
	instance.done = false;
    
	angle.min = angle.mid - angle.spread / 2;
	angle.max = angle.mid + angle.spread / 2;

	for (i = 0; i < MAX_STRANDS; i += 1) {
        rope = new Rope();
		rad = toRad(RandomUtil.i(angle.min, angle.max));
		mag = RandomUtil.i(6, 9);
        
		rope.move(origin.x(), origin.y());
		rope.velocity(Vector.xyzFromMagAngle(mag, rad));
		rope.accelerate(0, 0.2);
		list.push(rope);
	}

	instance.render = function (ctx) {
		var i,
            item,
            darkened;
        
        if (instance.done) {
			return;
		}
        darkened = ColorUtil.darken(color, 0.8);
        if (!darkened) {
            instance.done = true;
            return;
        }
		ctx.strokeStyle = ColorUtil.string.hsl(color);
		for (i = 0; i < list.length; i += 1) {
			item = list[i];
			item.render(ctx);
		}
	};
};