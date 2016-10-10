"use strict";
/*jslint browser:true, continue:true*/
/*global togglePlay, generateFireWork*/

document.body.addEventListener('keypress', function (event) {
    //console.log(event.which);
    switch (event.which) {
    case 32:
        togglePlay();
        break;
    
    case 102:
        generateFireWork();
        break;
	}
});