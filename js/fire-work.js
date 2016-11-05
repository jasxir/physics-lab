(function () {
    "use strict";
    /*jslint browser:true, continue:true*/
    /*global Color, ColorUtil, Movable, RandomUtil, RopeFactory, Rope, Vector, height, toRad*/
    
    var FireWork = function (x, y) {
        this.init.apply(this, arguments);
    },
        proto = FireWork.prototype,
        MAX_STRANDS = 9,
        angle = {
            'mid' : 270,
            'spread' : 100
        },
        ropeFactory;
    
    angle.min = angle.mid - angle.spread / 2;
    angle.max = angle.mid + angle.spread / 2;
    
    ropeFactory = new RopeFactory({
        'pointCount' : 4,
        'k' : 0.2,
        'line' : {
            'width' : {
                'min' : 0,
                'max' : 3
            }
        }
    });
    
    //TODO use general arguments.
    proto.init = function (x, y) {
        var rope,
            i,
            rad,
            mag;
        
        this.list = [];
        this.strokeStyle = Color.hsla(RandomUtil.i(0, 360), 100, 50, 1);
        this.origin = new Movable(x, y);
        this.done = false;
        
        for (i = 0; i < MAX_STRANDS; i += 1) {
            rope = ropeFactory.get();
            rad = Math.toRad(RandomUtil.i(angle.min, angle.max));
            mag = RandomUtil.i(9, 15);
            
            rope.place(this.origin.x(), this.origin.y());
            rope.move(Vector.xyFromMagAngle(mag, rad));
            rope.accelerate(0, 0.5);
            this.list.push(rope);
        }
    };
    
    proto.render = function (ctx) {
		var i,
            item,
            faded;
        
        if (this.done) {
			return;
		}
        
        faded = this.strokeStyle.fade(0.02);
        if (!faded) {
            this.done = true;
            return;
        }
        
        ctx.strokeStyle = this.strokeStyle.hslaString();
        
        for (i = 0; i < this.list.length; i += 1) {
			item = this.list[i];
			item.render(ctx);
		}
	};
    
    window.FireWork = FireWork;
    
}());