(function () {
    "use strict";
    /*jslint browser:true*/
    
    var RandomUtil = {
        'f' : function (min, max) {
            var range = max - min;
            return min + range * Math.random();
        },

        'i' : function (min, max) {
            var f = Math.ceil(RandomUtil.f(min - 1, max));
            return f;
        }
    };
    window.RandomUtil = RandomUtil;
}());