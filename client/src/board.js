// board.js
"use strict";

function Board(rows, cols, buffer, player) {
	this.rows = rows;
	this.cols = cols;
	this.buffer = buffer;
	this.player = player;
	this.grid = new Array(rows);
	this.colours = new Array(rows);
	let height = window.innerHeight;
	this.height = height - height * 0.2; // 20% of the height
	this.width = this.height / ((this.rows - buffer) / this.cols);
	var left = 0;
	var top = 0;
	for (let i = 0; i < this.grid.length; i++) {
		this.grid[i] = new Array(cols).fill(0);
		this.colours[i] = new Array(cols).fill({
			r: 255,
			g: 255,
			b: 255,
			a: 1
		});
	}
}

Board.prototype.print = function() {
		let line = '';
		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				line += '' + this.grid[i][j] + ' ';
			}
			line += '\n';
		}
		console.log(line);
	}

Board.prototype.addPolymino = function(tetromino) {
	let r = tetromino.positon.row;
	let c = tetromino.positon.col;

	for (let i = 0; i < tetromino.piece.length; i++) {
		for (let j = 0; j < tetromino.piece[i].length; j++) {
			let fill = tetromino.piece[i][j];
			if (fill) {
				this.grid[i + r][j + c] = fill;
				this.colours[i + r][j + c] = tetromino.sprite;
			}
		}
	}
}

Board.prototype.reset = function() {
	for (let i = 0; i < this.grid.length; i++) {
		for (let j = 0; j < this.grid[0].length; j++) {
			grid[i][j] = 0;
		}
	}
}

Board.prototype.getCoordinate = function(row, col) {
	let x = this.left + (col * this.gridWidth);
	let y = this.top + ((row - this.buffer) * this.gridHeight);
	return {
		x: x,
		y: y
	};
}


Board.prototype.drawBlocks = function(ctx) {
	for (let i = 0; i < this.grid.length; i++) {
		for (let j = 0; j < this.grid[0].length; j++) {
			let fill = this.grid[i][j];
			if (fill) {
				let coord = this.getCoordinate(i, j);
				ctx.drawImage(this.colours[i][j], coord.x, coord.y, this.gridWidth, this.gridHeight);
			}
		}
	}
}

Board.prototype.draw = function(ctx, canvas) {
	ctx.beginPath();
	this.left = canvas.scrollWidth / 2 - this.width / 2;
	let left = this.left;
	this.top = canvas.scrollHeight / 2 - this.height / 2;
	let top = this.top;
	let right = canvas.scrollWidth / 2 + this.width / 2;
	var bottom = canvas.scrollHeight / 2 + this.height / 2;

	ctx.moveTo(left, top);
	ctx.lineTo(right, top);
	ctx.lineTo(right, bottom);
	ctx.lineTo(left, bottom);
	ctx.lineTo(left, top);

	// draw the cols
	this.gridWidth = this.width / this.cols;
	this.gridHeight = this.height / (this.rows - this.buffer);
	for (let i = 0; i < this.cols; i++) {
		ctx.moveTo(left + this.gridWidth * i, top);
		ctx.lineTo(left + this.gridWidth * i, bottom);
	}

	// draw the rows
	for (let i = 0; i < this.rows - this.buffer; i++) {
		ctx.moveTo(left, top + this.gridHeight * i);
		ctx.lineTo(right, top + this.gridHeight * i);
	}

	ctx.strokeStyle = '#08B9C4';
	ctx.lineWidth = 2;
	ctx.shadowBlur = 0;
	ctx.stroke();
	this.drawBlocks(ctx);
}

Board.prototype.checkLine = function() {
	let rowCount = 0;
	outer: for (let i = this.rows - 1; i > 0; i--) {
		for (let j = 0; j < this.cols; j++) {
			if (this.grid[i][j] === 0)
				continue outer;
		}
		// full line here
		let row = this.grid.splice(i, 1)[0].fill(0);
		this.grid.unshift(row);
		let colourRow = this.colours.splice(i, 1)[0].fill(0);
		rowCount++;
		this.colours.unshift(colourRow);
		i++;
	}
	this.player.scoreLines(rowCount);
}

module.exports = Board;