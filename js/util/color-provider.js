(function () {
    var ColorProvider = function (options) {
        var instance = this,
            baseColor = options.baseColor,
            change = options.change;
        
        instance.get = function() {
            var color = baseColor.clone();
            change(baseColor);
            return color;
        };
    };
    
    window.ColorProvider = ColorProvider;
}());