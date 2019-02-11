let canvas;
let ctx;
let board;
let currentPiece;
let bag = [];
let lastUpdate = 0;
let gravityThreshold = 1000;
let gravityTimer = 0;

function getRGBA(colour) {
	return 'rgba('+colour.r+','+colour.g+','+colour.b+','+colour.a+')';
}