(function () {
    "use strict";
    /*jslint browser:true, continue:true*/
    /*global Event, animator, generateFireWork, dropBall, mouseMoved, ctx*/
    
    window.addEventListener('keypress', function (event) {
        //console.log(event.which);
        switch (event.which) {
        case 32://<Space>
            animator.toggle();
            break;

        case 98:
        case 66://<B><b>
            dropBall();
            break;

        case 102:
        case 70://<F><f>
            generateFireWork();
            break;

        case 43://<+>
            animator.fast();
            break;

        case 45://<->
            animator.slow();
            break;
        }
    });

    window.addEventListener('mousemove', function (event) {
        mouseMoved(event.clientX, event.clientY);
    });
    
    var resizeTimeoutId,
        MILLIS_TIMEOUT_RESIZE = 98;
    
    window.addEventListener('resize', function (event) {
        clearTimeout(resizeTimeoutId);
        resizeTimeoutId = setTimeout(function () {
            var newEvent = new Event('resized');
            window.dispatchEvent(newEvent);
        }, MILLIS_TIMEOUT_RESIZE);
    });
    
    window.addEventListener('resized', function (event) {
        ctx.resolution.factor();
    });
    
}());