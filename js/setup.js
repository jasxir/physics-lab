(function () {
    'use strict';
    /*global CanvasRenderer*/
    
    var canvasRenderer = new CanvasRenderer({
        surface : 'mCanvas'
    }),
        ctx = canvasRenderer.getContext();
    
    
    //ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    //TODO exposing to window, think of a better way.
    window.ctx = ctx;
    window.showMouse = function (doShow) {
        canvas.className = doShow ? '' : 'no-mouse';
    };
}());