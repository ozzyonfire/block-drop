// polyomino.js
"use strict";

function Polyomino(piece, colour, sprite, board, player) {
	this.colour = colour;
	this.piece = piece;
	this.sprite = sprite;
	this.player = player;
	this.positon = {
		row: board.buffer - this.piece.length,
		col: Math.floor(board.cols / 2 - this.piece[0].length / 2) 
	};
	this.landed = false;
	this.board = board;
}

Polyomino.prototype.rotateCCW = function() {
	let tempPiece = new Array(this.piece[0].length);
	for (let i = 0; i < tempPiece.length; i++) {
		tempPiece[i] = new Array(this.piece.length);
		for (let j = 0; j < tempPiece[i].length; j++) {
			let k = this.piece[j].length - 1 - i;
			tempPiece[i][j] = this.piece[j][k];
		}
	}
	this.piece = tempPiece;
}

Polyomino.prototype.rotateCW = function() {
	let tempPiece = new Array(this.piece[0].length);
	for (let i = 0; i < tempPiece.length; i++) {
		tempPiece[i] = new Array(this.piece.length);
		for (let j = 0; j < tempPiece[i].length; j++) {
			let k = this.piece.length - 1 - j;
			tempPiece[i][j] = this.piece[k][i];
		}
	}
	this.piece = tempPiece;
}

Polyomino.prototype.moveRight = function() {
	if (this.checkCollisionRight())
		this.positon.col++;
}

Polyomino.prototype.moveLeft = function() {
	if (this.checkCollisionLeft())
		this.positon.col--;
}

Polyomino.prototype.drop = function() {
	this.checkCollisionDown();
	if (!this.landed) {
		this.positon.row++;
	}
}

Polyomino.prototype.softDrop = function() {
	if (this.checkCollisionDown() && this.player) // not a ghost
		this.player.score += 1; // one point for every line you soft drop
	this.drop();
}

Polyomino.prototype.hardDrop = function() {
	while(this.checkCollisionDown()) { // not a ghost
		if (this.player)
			this.player.score += 2; // 2 points for every line that you hard drop
		this.drop();
	}
}

Polyomino.prototype.checkCollisionRight = function() {
	for (let i = 0; i < this.piece.length; i++) {
		for (let j = 0; j < this.piece[i].length; j++) {
			if (this.piece[i][j]) {
				let boardRow = this.positon.row + i;
				let boardCol = this.positon.col + j + 1; // one to the right
				if (boardCol >= this.board.cols || this.boardRow >= this.board.rows) {
					return false;
				} else if (this.board.grid[boardRow][boardCol]) {
					return false;
				}
			}
		}
	}
	return true;
}

Polyomino.prototype.checkCollisionDown = function() {
	if (this.positon.row < 0) {
		return true;
	}
	let lastRow = this.piece.length - 1;
	for (let i = lastRow; i >= 0; i--) {
		for (let j = 0; j < this.piece[i].length; j++) {
			let fill = this.piece[i][j];
			if (fill) {
				let boardRow = this.positon.row + i + 1;
				let boardCol = this.positon.col + j;
				if (boardRow >= this.board.rows) {
					this.landed = true;
					return false;
				}
				let collision = this.board.grid[boardRow][boardCol];
				if (collision) {
					this.landed = true;
					return false;
				}
			}
		}
	}
	return true;
}

Polyomino.prototype.checkCollisionLeft = function() {
		for (let i = 0; i < this.piece.length; i++) {
			for (let j = 0; j < this.piece[i].length; j++) {
				if (this.piece[i][j]) {
					let boardRow = this.positon.row + i;
					let boardCol = this.positon.col + j - 1; // one to the left
					if (boardCol < 0 || boardRow >= this.board.rows) {
						return false;
					} else if (this.board.grid[boardRow][boardCol]) {
						return false;
					}
				}
			}
		}
		return true;
	}

Polyomino.prototype.drawGhost = function(ctx) {
	let ghost = new Polyomino(this.piece, JSON.parse(JSON.stringify(this.colour)), this.sprite, this.board);
	ghost.positon = {
		row: this.positon.row,
		col: this.positon.col
	};
	ghost.colour.r += 20;
	ghost.colour.g += 20;
	ghost.colour.b += 20;
	ghost.colour.a = 1;
	ghost.hardDrop();
	ghost.landed = false;
	ghost.drawOutline(ctx);
}

Polyomino.prototype.drawOutline = function(ctx) {
		for (let i = 0; i < this.piece.length; i++) {
			for (let j = 0; j < this.piece[i].length; j++) {
				let fill = this.piece[i][j];
				if (this.positon.row + i < this.board.buffer) {
					fill = 0;
				}
				if (fill) {
					let coord = this.board.getCoordinate(this.positon.row + i, this.positon.col + j);
					ctx.strokeStyle = getRGBA(this.colour);
					ctx.shadowBlur = 15;
					ctx.shadowColor = getRGBA(this.colour);
					ctx.lineWidth = 4;
					ctx.lineJoin = 'round';
					ctx.strokeRect(coord.x, coord.y, this.board.gridWidth, this.board.gridHeight);
				}
			}
		}
	}

Polyomino.prototype.draw = function(ctx) {
	for (let i = 0; i < this.piece.length; i++) {
		for (let j = 0; j < this.piece[i].length; j++) {
			let fill = this.piece[i][j];
			if (this.positon.row + i < this.board.buffer) {
				fill = 0;
			}
			if (fill) {
				let coord = this.board.getCoordinate(this.positon.row + i, this.positon.col + j);
				ctx.drawImage(this.sprite, coord.x, coord.y, this.board.gridWidth, this.board.gridHeight);
			}
		}
	}
}

function getRGBA(colour) {
	return 'rgba('+colour.r+','+colour.g+','+colour.b+','+colour.a+')';
}

module.exports = Polyomino;