(function () {
    "use strict";
    /*jslint browser:true*/
    
    var Animator = function (options) {
        var MIN_DELAY = 16,// 60fps,
            MAX_DELAY = 100,
            instance = this,
            callback,
            playing,
            delay,
            step;

        options = options || {};
        if (options.constructor === Function) {
            callback = options;

        } else {
            callback = options.callback;
        }

        if (!callback) {
            return;
        }

        if (options.playing !== undefined) {
            playing = options.playing;
        } else {
            playing = true;
        }
        
        delay = options.delay || MIN_DELAY;
        
        step = function (timestamp) {//What this timestamp?
            callback();
            //TODO somehow remove this if check.
            if (playing) {
                window.setTimeout(function () {
                    window.requestAnimationFrame(step);
                }, delay);
            }
        };

        instance.toggle = function (givenValue) {
            var newValue = (givenValue !== undefined) ? givenValue : !playing;
            playing = newValue;
            if (newValue) {
                step();
            }
        };

        instance.delay = function (givenValue) {
            delay = givenValue;
        };

        instance.slow = function () {
            if (delay < MAX_DELAY) {
                delay += 1;
            }
        };

        instance.fast = function () {
            if (delay > MIN_DELAY) {
                delay -= 1;
            }
        };

        instance.play = function () {
            this.toggle(true);
        };

        instance.pause = function () {
            this.toggle(false);
        };

        if (playing) {
            step();
        }
    };
    
    window.Animator = Animator;
}());
