(function () {
    "use strict";
    /*jslint browser:true*/
    /*global Vector, ctx*/

    var Spring = function () {
        this.init.apply(this, arguments);
    },
        proto = Spring.prototype;
    
    proto.init = function (options) {
        this.p1 = options.p1;
        this.p2 = options.p2;
        this.length = options.length || 1;
        this.k = options.k || 0.9;
    };
    
    proto.integrate = function () {
        if (this.broken) {
            return;
        }
        
        var k = this.k,
            p1 = this.p1,
            p2 = this.p2,
            length = this.length,
            distance = p1.position.clone().sub(p2.position),
            dMag = distance.mag();
        
        distance.setMag(dMag - length);
        p2.move(distance.x * k, distance.y * k);
    };
    
    proto.setBroken = function () {
        this.broken = true;
    };
    
    window.Spring = Spring;
}());