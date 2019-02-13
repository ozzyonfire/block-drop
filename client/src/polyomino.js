// polyomino.js
"use strict";
const _ = require('lodash');
const state = {
	NORTH: 0,
	EAST: 1,
	SOUTH: 2,
	WEST: 3
};

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
	this.locked = false;
	this.board = board;
	this.state = state.NORTH;
}

Polyomino.prototype.lockedTimer = _.debounce(function() {
	let polyomino = this;
	if (!polyomino.drop() && polyomino.landed) {
		polyomino.locked = true;
	}
}, 480);

Polyomino.prototype.rotateCCW = function() {
	let tempPiece = rotatePieceCCW(this.piece);
	let rotated = false;
	if (this.checkCollision(tempPiece, this.positon)) { // normal rotation
		this.piece = tempPiece;
		rotated = true;
	}	else {
		if (this.wallKick(1, tempPiece, false)) { // wall kicks
			this.piece = tempPiece;
			rotated = true;
		}
	}

	if (rotated) {
		switch (this.state) {
			case state.NORTH:
				this.state = state.WEST;
				break;
			case state.EAST:
				this.state = state.NORTH;
				break;
			case state.SOUTH:
				this.state = state.EAST;
				break;
			case state.WEST:
				this.state = state.SOUTH;
				break;
		}
	}
}

Polyomino.prototype.wallKick = function(testNumber, tempPiece, clockwise) {
	if (testNumber > 4) {
		return false;
	} else {
		let tempPosition = {
			row: this.positon.row,
			col: this.positon.col
		};
		switch (this.state) {
			case state.NORTH:
				switch (testNumber) {
					case 1:
						if (clockwise) // 0 >> 1
							tempPosition.col -= 1;
						else // 0 >> 3
							tempPosition.col += 1;
						break;
					case 2:
						if (clockwise) { // 0 >> 1
							tempPosition.col -= 1;
							tempPosition.row += 1;
						} else { // 0 >> 3
							tempPosition.row += 1;
							tempPosition.col += 1;
						}
						break;
					case 3:
							tempPosition.row -= 2; // 0 >> 1 & 0 >> 3
						break;
					case 4:
						if (clockwise) { // 0 >> 1
							tempPosition.col -= 1;
							tempPosition.row -= 2;
						} else { // 0 >> 3
							tempPosition.col += 1;
							tempPosition.row -= 2;
						}
						break;
				}
				break;

		}
	}
	if (this.checkCollision(tempPiece, tempPosition)) {
		return true;
	} else {
		return this.wallKick(++testNumber, tempPiece, clockwise);
	}
}

Polyomino.prototype.rotateCW = function() {
	let tempPiece = rotatePieceCW(this.piece);
	if (this.checkCollision(tempPiece, this.positon)) {
		this.piece = tempPiece;
	}
}

Polyomino.prototype.move = function(newPosition) {
	if (this.checkCollision(this.piece, newPosition)) {
		this.positon = newPosition;
		return true; // successfull move
	} else {
		return false;
	}
}

Polyomino.prototype.moveRight = function() {
	let tempPosition = {
		row: this.positon.row,
		col: this.positon.col + 1
	};
	this.move(tempPosition);
}

Polyomino.prototype.moveLeft = function() {
	let tempPosition = {
		row: this.positon.row,
		col: this.positon.col - 1
	};
	this.move(tempPosition);
}

Polyomino.prototype.drop = function() {
	let tempPosition = {
		row: this.positon.row + 1,
		col: this.positon.col,
	};
	let success = this.move(tempPosition);
	if (this.player) { // not the ghost
		tempPosition = {
			row: this.positon.row + 1,
			col: this.positon.col
		};
		this.checkCollision(this.piece, tempPosition);
	}
	return success;
}

Polyomino.prototype.softDrop = function() {
	if (this.drop() && this.player) {
		this.player.score += 1;
	}
}

Polyomino.prototype.hardDrop = function() {
	while(this.drop()) {
		if (this.player) // not a ghost
			this.player.score += 2; // 2 points for every line that you hard drop
	}
	this.locked = true;
}

Polyomino.prototype.checkCollision = function(piece, position) {
	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[i].length; j++) {
			if (piece[i][j]) {
				let boardRow = position.row + i;
				let boardCol = position.col + j;
				if (boardRow >= this.board.rows || this.board.grid[boardRow][boardCol]) { // landed
					this.landed = true;
					if (this.player) // not the ghost piece
						this.lockedTimer();
					return false;
				} else if (boardCol < 0 || boardCol >= this.board.cols) {
					return false; // off the board
				}
			}
		}
	}
	this.landed = false;
	if (this.player) // not the ghost
		this.lockedTimer.cancel();
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

function rotatePieceCW(piece) {
	let tempPiece = new Array(piece[0].length);
	for (let i = 0; i < tempPiece.length; i++) {
		tempPiece[i] = new Array(piece.length);
		for (let j = 0; j < tempPiece[i].length; j++) {
			let k = piece.length - 1 - j;
			tempPiece[i][j] = piece[k][i];
		}
	}
	return tempPiece;
}

function rotatePieceCCW(piece) {
	let tempPiece = new Array(piece[0].length);
	for (let i = 0; i < tempPiece.length; i++) {
		tempPiece[i] = new Array(piece.length);
		for (let j = 0; j < tempPiece[i].length; j++) {
			let k = piece[j].length - 1 - i;
			tempPiece[i][j] = piece[j][k];
		}
	}
	return tempPiece;
}
module.exports = Polyomino;