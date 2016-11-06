"use strict";
/*jslint browser:true*/
/*global Rope, merge*/

var RopeFactory = function (options) {
    var line,
        DEFAULT_OPTIONS = {
            pointCount    : 40,
            k       : 0.89,
            line : {
                width : {
                    min : 1,
                    max : 8
                }
            },
            length : 0.5
        };
    
    options = merge.left(DEFAULT_OPTIONS, options);
    line = options.line;
    line.width.ratio = (line.width.max - line.width.min) / options.pointCount;
    
    this.get = function () {
        return new Rope(options);
    };
};

var defaultRopeFactory = new RopeFactory();