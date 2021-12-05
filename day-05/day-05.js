"use strict";

function day5(input) {
	const FILE_REGEX = /(\d+),(\d+) -> (\d+),(\d+)/g;
	let lines = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		lines.push([[+entry[1], +entry[2]], [+entry[3], +entry[4]]]);
		// [ [x1, y1], [x2, y2] ]
	}

	let board = new Map();
	lines.forEach(function(line) {
		if(line[0][0] === line[1][0]) {
			let lowest = line[0][1] < line[1][1] ? line[0][1] : line[1][1];
			let highest = line[0][1] < line[1][1] ? line[1][1] : line[0][1];
			for(let i = 0; lowest + i <= highest; i++) {
				let iKey = `${line[0][0]},${lowest + i}`;
				if(board.has(iKey)) {
					board.set(iKey, board.get(iKey) + 1);
				} else {
					board.set(iKey, 1);
				}
			}
		} else if(line[0][1] === line[1][1]) {
			let lowest = line[0][0] < line[1][0] ? line[0][0] : line[1][0];
			let highest = line[0][0] < line[1][0] ? line[1][0] : line[0][0];
			for(let i = 0; lowest + i <= highest; i++) {
				let iKey = `${lowest + i},${line[0][1]}`;
				if(board.has(iKey)) {
					board.set(iKey, board.get(iKey) + 1);
				} else {
					board.set(iKey, 1);
				}
			}
		}
	});

	let doubled = 0;
	board.forEach(function(val) {
		if(val >= 2) {
			doubled++;
		}
	});
	displayText(`Overlap points: ${doubled}`);
}