(function () {
    "use strict";
    /*jslint browser:true*/
    
    var ValueLister = function () {
        var instance = this,
            arg = arguments,
            index = 0;

        instance.get = function () {
            var value = arg[index];
            index += 1;
            if (index === arg.length) {
                index = 0;
            }
            return value;
        };
    };
    window.ValueLister = ValueLister;
}());