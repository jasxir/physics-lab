var canvas = document.getElementById('mCanvas');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
ctx.lineWidth = 3;
ctx.strokeStyle = '#888';
ctx.lineCap = 'round';

var toRad = function(deg) {
	return deg * Math.PI/180;
};