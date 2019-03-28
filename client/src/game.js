const $ = require('jquery');
const Player = require('./player');
const Polyomino = require('./polyomino');
const Board = require('./board');
const randomizer = require('./randomizer');

function Game() {
	this.player = new Player();
	this.board = new Board(25, 10, 5, this.player);
	this.canvas = $('#canvas')[0];
	canvas.width = this.board.width + 10; // 10 pixel border
	canvas.height = this.board.height + 10;
	this.ctx = this.canvas.getContext('2d');
	this.bag = [];
	this.currentPiece = null;
	this.lastUpdate = 0;
	this.gravityTimer = 0;
	this.getNextPiece();
}

Game.prototype.getNextPiece = function() {
	if (this.bag.length == 0) {
		this.bag = randomizer.newBag();
	}
	let tetromino = this.bag.pop();
	this.currentPiece = new Polyomino(tetromino.piece, tetromino.colour, tetromino.sprite, this.board, this.player);
}

// UPDATES AND RENDERING
Game.prototype.gameLoop = function(now) {
	if (!this.lastUpdate) {
		this.lastUpdate = now;
	}
	let deltaTime = now - this.lastUpdate;
	this.lastUpdate = now;
	this.gameUpdate(deltaTime);
	this.renderUpdate();
}

Game.prototype.gameUpdate = function(deltaTime) {
	if (deltaTime)
		this.gravityTimer += deltaTime;
	if (this.gravityTimer >= this.player.gravity()) {
		if (!this.currentPiece.landed)
			this.currentPiece.drop();
		this.gravityTimer = 0;
	}
	if (this.currentPiece.locked && !this.board.animating) {
		this.board.addPolyomino(this.currentPiece);
		let game = this;
		this.board.checkLine(function() {
			game.getNextPiece();
		});
	}
	this.updateScore();
}

Game.prototype.updateScore = function() {
	$('#score').text(this.player.score);
	$('#lines').text(this.player.lines);
	$('#level').text(this.player.level);
}

Game.prototype.renderUpdate = function() {
	this.ctx.clearRect(0, 0, canvas.width, canvas.height);
	this.board.draw(this.ctx, canvas);
	this.currentPiece.draw(this.ctx);
	this.currentPiece.drawGhost(this.ctx);
}

module.exports = Game;