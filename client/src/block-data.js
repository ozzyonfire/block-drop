// block-data.js
"use strict";

let blueBlock = new Image();
blueBlock.src = './client/img/blocks/blue-block.gif';
let greenBlock = new Image();
greenBlock.src = './client/img/blocks/green-block.gif';
let cyanBlock = new Image();
cyanBlock.src = './client/img/blocks/cyan-block.gif';
let purpleBlock = new Image();
purpleBlock.src = './client/img/blocks/purple-block.gif';
let orangeBlock = new Image();
orangeBlock.src = './client/img/blocks/orange-block.gif';
let yellowBlock = new Image();
yellowBlock.src = './client/img/blocks/yellow-block.gif';
let redBlock = new Image();
redBlock.src = './client/img/blocks/red-block.gif';

// define the pieces
let i = {
	piece: [[0, 0, 0, 0],
					[1, 1, 1, 1],
					[0, 0, 0, 0],
					[0, 0, 0, 0]],
	colour: {
		r: 84,
		g: 201,
		b: 234,
		a: 1
	},
	sprite: cyanBlock
};
				
let t = {
	piece: [[0, 1, 0],
					[1, 1, 1],
					[0, 0, 0]],
	colour: {
		r: 165,
		g: 121,
		b: 182,
		a: 1
	},
	sprite: purpleBlock
};

let j =  {
	piece: [[1, 0, 0],
					[1, 1, 1],
					[0, 0, 0]],
	colour: {
		r: 66,
		g: 157,
		b: 214,
		a: 1
	},
	sprite: blueBlock
};

let l = {
	piece: [[0, 0, 1],
					[1, 1, 1],
					[0, 0, 0]],
	colour: {
		r: 246,
		g: 138,
		b: 33,
		a: 1
	},
	sprite: orangeBlock
};

let o = {
	piece: [[1, 1],
					[1, 1]],
	colour: {
		r: 252,
		g: 227,
		b: 85,
		a: 1
	},
	sprite: yellowBlock
};

let s = { 
	piece: [[0, 1, 1],
					[1, 1, 0],
					[0, 0, 0]],
	colour: {
		r: 104,
		g: 109,
		b: 69,
		a: 1
	},
	sprite: greenBlock
};

let z = {
	piece: [[1, 1, 0], 
					[0, 1, 1],
					[0, 0, 0]],
	colour: {
		r: 237,
		g: 43,
		b: 62,
		a: 1
	},
	sprite: redBlock
};

module.exports.t = t;
module.exports.i = i;
module.exports.j = j;
module.exports.l = l;
module.exports.s = s;
module.exports.z = z;
module.exports.o = o;