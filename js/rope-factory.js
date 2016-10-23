"use strict";
/*jslint browser:true*/
/*global Rope, merge*/

var RopeFactory = function (options) {
    var line,
        DEFAULT_OPTIONS = {
            'pointCount'    : 30,
            'stretch'       : 0.6,
            'line' : {
                'width' : {
                    'min' : 1,
                    'max' : 6
                }
            }
        };
    
    options = merge.left(DEFAULT_OPTIONS, options);
    line = options.line;
    line.width.ratio = (line.width.max - line.width.min) / options.pointCount;
    
    this.get = function () {
        return new Rope(options);
    };
};

var defaultRopeFactory = new RopeFactory();