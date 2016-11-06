(function () {
    "use strict";
    /*jslint browser:true, continue:true*/
    /*global Animator, Bubble, FireWork, Color, InfinityAnimator,
        RandomUtil, defaultRopeFactory, ctx, showMouse*/
    
    var fireWorkList = [],
        emptyIndexList = [],
        bubbleList = [],
        padding = 200,
        followerRope = defaultRopeFactory.get(),
        
        generateFireWork = function () {
            var x = RandomUtil.i(padding, ctx.width - padding),
                y = RandomUtil.i(padding, padding + 100),
                fireWork = new FireWork(x, y),
                index;
            
            if (emptyIndexList.length) {
                index = emptyIndexList.pop();
                fireWorkList[index] = fireWork;
            } else {
                fireWorkList.push(fireWork);
            }
        },
        
        dropBall = function () {
            var bubble = new Bubble(),
                x = RandomUtil.i(padding, ctx.width - padding),
                y = RandomUtil.i(padding, padding + 100),
                index;

            bubble.place(x, y);
            bubble.radius(5);
            bubble.move(2, -6, 0);
            bubble.accelerate(0, 0.3, 0);
            bubbleList.push(bubble);
        },
        
        render = function (ctx) {
            ctx.clear();
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
        },
        
        integrate = function () {
            //bubble.integrate();
        },
        
        infinityAnimator =  new InfinityAnimator({
            offsetX : ctx.width / 2,
            offsetY : ctx.height / 2
        }),
        
        mouseMoveTimeoutId,
        mouseIdle = false,
        
        playInfinity = function () {
            infinityAnimator.step(function (x, y) {
                followerRope.hueShift();
                followerRope.setOrigin(x, y);
            });
        },
        
        mouseMoved = function (x, y) {
            x = ctx.localX(x);
            y = ctx.localY(y);
            mouseIdle = false;
            //showMouse(mouseIdle);
            clearTimeout(mouseMoveTimeoutId);
            mouseMoveTimeoutId = setTimeout(function () {
                mouseIdle = true;
                //showMouse(mouseIdle);
            }, 3000);
            
            if (!mouseIdle) {
                followerRope.hueShift();
                followerRope.setOrigin(x, y);
            }
        },
        
        animator = new Animator({
            playing : false,
            callback : function () {
                if (mouseIdle) {
                    playInfinity();
                }
                render(ctx);
            }
        });
    
    followerRope.strokeStyle = Color.hsla(0, 100, 50, 1);
    followerRope.hueShift = function () {
        followerRope.strokeStyle.hueShift(0.5);
    };
    
    ctx.onResolutionChanged = function(width, height) {
        infinityAnimator.set({
            width : width * 0.3,
            height : height * 0.3,
            offsetX : width / 2,
            offsetY : height / 2
        });
    }
    
    animator.play();
    
    window.mouseMoved = mouseMoved;
    window.animator = animator;
    window.generateFireWork = generateFireWork;
    window.dropBall = dropBall;
}());