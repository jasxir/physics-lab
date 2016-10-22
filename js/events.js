"use strict";
/*jslint browser:true, continue:true*/
/*global animator, generateFireWork, dropBall, mouseMoved*/

document.body.addEventListener('keypress', function (event) {
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

document.body.addEventListener('mousemove', function (event) {
    mouseMoved(event.clientX, event.clientY);
});