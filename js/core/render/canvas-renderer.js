(function () {
    var CanvasRenderer = function (options) {
        var instance = this,
            canvas = document.getElementById(options.surface),
            ctx = canvas.getContext('2d'),
            resolutionFactor = 1;
        
        ctx.resolution = function (width, height) {
            if (arguments.length > 1) {
                ctx.width = canvas.width = width;
                ctx.height = canvas.height   = height;
                
                if (ctx.onResolutionChanged) {
                    ctx.onResolutionChanged(ctx.width, ctx.height);
                }
            }
            
            return {
                width   : ctx.width,
                height  : ctx.height
            };
        };
        
        ctx.resolution.factor = function (factor) {
            if(factor) {
                resolutionFactor = factor;
            }
            ctx.resolution(window.innerWidth * resolutionFactor, window.innerHeight * resolutionFactor);
        };
        
        ctx.resolution.auto = function () {
            ctx.resolution.factor();
        };
        
        ctx.localX = function (x) {
            return x * ctx.width / window.innerWidth;
        };
        
        ctx.localY = function (y) {
            return y * ctx.height / window.innerHeight;
        };
        
        ctx.clear = function () {
            ctx.clearRect(0, 0, ctx.width, ctx.height);
        };
        
        instance.getContext = function () {
            return ctx;
        };
    };
    
    window.CanvasRenderer = CanvasRenderer;
}());