(function () {
    "use strict";
    
    Math.DEG2RAD = Math.PI / 180;
    Math.MAX_DEGREE = Math.DEG2RAD * 360;
    
    Math.toRad = function (deg) {
        return deg * Math.DEG2RAD;
    };
}());