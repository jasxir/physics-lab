"use strict";
/*jslint browser:true, continue:true*/
/*global Animator, Rope, Bubble, FireWork, RandomUtil, width, height, ctx*/

var fireWorkList = [];
var emptyIndexList = [];
var bubbleList = [];
var fireWork = new FireWork();
var padding = 200;

var followerRope = defaultRopeFactory.get();
followerRope.strokeStyle = 'red';

var generateFireWork = function () {
	var x = RandomUtil.i(padding, width - padding),
        y = RandomUtil.i(padding, padding + 100),
        fireWork = new FireWork(x, y),
        index;
    
	if (emptyIndexList.length) {
		index = emptyIndexList.pop();
		fireWorkList[index] = fireWork;

	} else {
		fireWorkList.push(fireWork);
	}
};

var dropBall = function () {
    var bubble = new Bubble(),
        x = RandomUtil.i(padding, width - padding),
        y = RandomUtil.i(padding, padding + 100),
        index;
    
    bubble.place(x, y);
    bubble.radius(5);
    bubble.move(2, -6, 0);
    bubble.accelerate(0, 0.3, 0);
    bubbleList.push(bubble);
};

generateFireWork();

var render = function (ctx) {
	ctx.fillRect(0, 0, width, height);
    followerRope.render(ctx);
	var fireWork, i;
	//var removeList = [];
	for (i = 0; i < fireWorkList.length; i += 1) {
		fireWork = fireWorkList[i];
		if (!fireWork) {
			continue;
		}

		if (fireWork.done) {
			fireWorkList[i] = null;
			emptyIndexList.push(i);
			continue;
		}

		fireWork.render(ctx);
	}
    
    for (i = 0; i < bubbleList.length; i += 1) {
        bubbleList[i].render(ctx);
    }
};

var integrate = function () {
	//bubble.integrate();
};

var animator = new Animator(function () {
    render(ctx);
});

var mouseMoved = function (x, y) {
    //console.log(x, y);
    followerRope.setOrigin(x, y);
};