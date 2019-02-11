const Game = require('./game');
const $ = require('jquery');

let theGame = new Game();

function update(now) {
	requestAnimationFrame(update);
	theGame.gameLoop(now);
}

update();

$(window).on('keydown', function(e) {
	if (e.keyCode === 37) { // left
		theGame.currentPiece.moveLeft();
	} else if (e.keyCode === 39) { // right
		theGame.currentPiece.moveRight();
	} else if (e.keyCode === 40) { // down
		theGame.currentPiece.softDrop();
	} else if (e.keyCode === 90) { // z
		theGame.currentPiece.rotateCCW();
	} else if (e.keyCode === 88) { // x
		theGame.currentPiece.rotateCW();
	} else if (e.keyCode === 38) {  // up
		theGame.currentPiece.hardDrop();
	}
});

$('#leftButton').click(e => {
	theGame.currentPiece.moveLeft();
});

$('#rightButton').click(e => {
	theGame.currentPiece.moveRight();
});

$('#upButton').click(e => {
	theGame.currentPiece.hardDrop();
});

$('#downButton').click(e => {
	theGame.currentPiece.softDrop();
});

$('#rotateCW').click(e => {
	theGame.currentPiece.rotateCW();
});

$('#rotateCCW').click(e => {
	theGame.currentPiece.rotateCCW();
});

$('#canvas').on('touchstart', function(e) {
	let halfScreen = window.innerWidth / 2;
	if (e.changedTouches[0].clientX < halfScreen) {
		theGame.currentPiece.moveLeft();
	} else {
		theGame.currentPiece.moveRight();
	}
});