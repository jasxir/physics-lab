(function () {
    "use strict";

    var FunctionUtil = {
        "apply" : function (fn, arg, index, ctx) {
            var i,
                list = null;

            if (index) {
                list = [];
                for (i = index; i < arg.length; i += 1) {
                    list.push(arg[i]);
                }

            } else {
                list = arg;
            }
            return fn.apply(ctx, list);
        }
    };
}());
