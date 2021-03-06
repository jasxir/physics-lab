(function () {
    "use strict";
    /*jslint browser:true, continue:true*/
    /*global merge*/
    
    var InfinityAnimator = function () {
        this.init.apply(this, arguments);
    },
        proto = InfinityAnimator.prototype,
        
        DEFAULT_SETTINGS = {
            offsetX : 0,
            offsetY : 0,
            width : 200,
            height : 100,
            angle : {
                value : 0,
                change : Math.toRad(1)
            }
        };
    
    proto.init = function (options) {
        merge.left(DEFAULT_SETTINGS, options, this);
    };
    
    proto.set = function (options) {
        merge.left(this, options, this);
    };
    
    proto.step = function (callback) {
        var dx,
            dy,
            mul = 4;
        
        this.angle.value += this.angle.change;
        
        this.width += 0.05;
        this.height += 0.05;
        
        if (this.angle.value >= Math.MAX_DEGREE) {
            this.angle.value = 0;
        }
        
        dx = this.width * Math.sin(this.angle.value);
        dy = this.height * Math.sin(mul * this.angle.value);
        callback(this.offsetX + dx, this.offsetY + dy);
    };
    
    window.InfinityAnimator = InfinityAnimator;
}());