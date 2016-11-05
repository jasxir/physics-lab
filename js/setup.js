(function () {
    'use strict';
    
    var canvas = document.getElementById('mCanvas'),
        ctx = canvas.getContext('2d'),
        resolutionMultiplier = 1;
    
    canvas.width = window.innerWidth * resolutionMultiplier;
    canvas.height = window.innerHeight * resolutionMultiplier;
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#888';
    ctx.lineCap = 'round';
    
    //TODO exposing to window, think of a better way.
    window.ctx = ctx;
    window.showMouse = function (doShow) {
        canvas.className = doShow ? '' : 'no-mouse';
    };
}());