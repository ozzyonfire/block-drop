// player.js
"use strict";

let Player = function() {
	this.score = 0;
	this.level = 0;
	this.lines = 0;
}

Player.prototype.gravity = function() {
	let lines = this.lines % 10;
	if (this.level == 0) {
		return 786 - (lines * 5);
	} else if (this.level == 1) {
		return 688 - (lines * 5);	
	} else if (this.level == 2) {
		return 608 - (lines * 5);
	} else if (this.level == 3) {
		return 528 - (lines * 5);
	} else if (this.level == 4) {
		return 448 - (lines * 4);
	} else if (this.level == 5) {
		return 368 - (lines * 4);
	} else if (this.level == 6) {
		return 288 - (lines * 4);
	} else if (this.level == 7) {
		return 208 - (lines * 4);
	} else {
		return 200;
	}
}

Player.prototype.scoreLines = function(lines) {
	//console.log(this.score);
	//console.log(this.level);
	console.log(lines);
	this.lines += lines;
	if (this.lines > 0 && this.lines % 10 == 0) {
		this.level++;
	}
	switch(lines) {
		case 1:
			this.score += 100 * this.level;
			break;
		case 2:
			this.score += 300 * this.level;
			break;
		case 3:
			this.score += 500 * this.level;
			break;
		case 4: 
			this.score += 800 * this.level;
			break;
	}
}

module.exports = Player;