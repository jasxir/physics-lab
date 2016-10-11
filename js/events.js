"use strict";
/*jslint browser:true, continue:true*/
/*global togglePlay, generateFireWork*/

document.body.addEventListener('keypress', function (event) {
    //console.log(event.which);
    switch (event.which) {
    case 32://<Space>
        togglePlay();
        break;
    
    case 98: case 66://<B><b>
        dropBall();
        break;
            
    case 102: case 70://<F><f>
        generateFireWork();
        break;
    
    case 43://<+>
        speed.up();
        break;
            
    case 45://<->
        speed.down();
        break;
	}
});