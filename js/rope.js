var Rope = function() {
	var instance = this;
	var MAX_SEGMENTS = 7;
	//var SEG_DISTANCE = 5;
	var stretch = 0.4;

	var line = {
		'width' : {
			'min' : 0,
			'max' : 3
		}
	};

	line.width.ratio = (line.width.max - line.width.min) / MAX_SEGMENTS;
	
	//var colorLister = new ValueLister(ColorUtil.rgb(255, 5, 5), ColorUtil.rgb(200, 200, 0));
	var colorLister = null;

	var list = [];

	for(var i = 0; i < MAX_SEGMENTS; i++) {
		list.push(new Movable());
	}

	var origin = list[0];

	var onEach = function(callback) {
		for(var i = 0; i < list.length; i++) {
			callback(list[i], i);
		}
	};

	instance.render = function(ctx) {
		var divisor = 1.8;
		var xLast, yLast;
		onEach(function(point, i) {
			//Integrating
			if(i) {

				var dx = xLast - point.x();
				var dy = yLast - point.y();
				var d = Math.pow(dx, 2) + Math.pow(dy, 2);
				d = Math.pow(d, 1/2);
				//if(d > SEG_DISTANCE)
				{
					point.velocity(dx*stretch, dy*stretch);
				}
			}
			point.integrate();
			
			/////////////
			//Rendering//
			/////////////
			if(i) {
				if(colorLister != null) {
					ctx.strokeStyle = colorLister.get();
				}
				ctx.lineWidth = line.width.min + (list.length - i) * line.width.ratio;	
				ctx.beginPath();
				ctx.moveTo(xLast, yLast);
				ctx.lineTo(point.x(), point.y());
				ctx.stroke();
			}

			xLast = point.x();
			yLast = point.y();
		});
	};

	instance.move = function() {
		var arg = arguments;
		onEach(function(item) {
			item.move.apply(null, arg);
		});
	};

	instance.velocity = origin.velocity;
	instance.accelerate = origin.accelerate;
	instance.setMagAngle = origin.setMagAngle;
	instance.x = origin.x;
	instance.y = origin.y;
};