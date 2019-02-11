// randomizer.js
"use strict";

let blockData = require('./block-data');

function newBag() {
	let bag = [];
	let tetrominos = [
		blockData.i,
		blockData.t,
		blockData.j,
		blockData.l,
		blockData.o,
		blockData.z,
		blockData.s
	];
	while (tetrominos.length > 0) {
		let index = Math.floor(Math.random() * tetrominos.length);
		bag.push(tetrominos.splice(index, 1)[0]);
	}
	return bag;
}

module.exports.newBag = newBag;