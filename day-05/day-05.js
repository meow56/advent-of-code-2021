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
	let highestX = 0;
	let highestY = 0;
	board.forEach(function(val, key) {
		if(val >= 2) {
			doubled++;
		}
		let coord = key.split(",");
		if(+coord[0] > highestX) {
			highestX = +coord[0];
		}
		if(+coord[1] > highestY) {
			highestY = +coord[0];
		}
	});
	let firstX = "~~~~";
	let secondX = "~~~~";
	let thirdX = "~~~~";
	for(let x = 0; x < highestX; x++) {
		if(x % 10 === 0) {
			firstX += Math.floor(x / 100);
			secondX += Math.floor(x % 100 / 10);
			thirdX += "0";
		} else {
			firstX += "_";
			secondX += "_";
			thirdX += "_";
		}
	}
	displayText(firstX);
	displayText(secondX);
	displayText(thirdX);
	displayText("~~~@".padEnd(highestX + 4, "@"));
	for(let y = 0; y < highestY; y++) {
		let toDisplay = y.toString() + "@";
		toDisplay = toDisplay.padStart(4, "0");
		for(let x = 0; x < highestX; x++) {
			let xYKey = `${x},${y}`;
			if(board.has(xYKey)) {
				if(board.get(xYKey) >= 10) console.warn(`Value of ${xYKey} is two or more digits long.`);
				toDisplay += board.get(xYKey);
			} else {
				toDisplay += ".";
			}
		}
		displayText(toDisplay);
	}
	displayText(`Overlap points: ${doubled}`);
	lines.forEach(function(line) {
		if(line[0][0] !== line[1][0] && line[0][1] !== line[1][1]) {
			let lowestX = line[0][0] < line[1][0] ? line[0][0] : line[1][0];
			let highestX = line[0][0] < line[1][0] ? line[1][0] : line[0][0];
			let lowestY = line[0][0] < line[1][0] ? line[0][1] : line[1][1];
			let highestY = line[0][0] < line[1][0] ? line[1][1] : line[0][1];
			// Note the condition on lowestY and highestY.
			// Kinda a variable misnomer, but I am
			// feeling lazy and I think I can make the case
			// that it matches lowestX and highestX.

			for(let i = 0; lowestX + i <= highestX; i++) {
				let iKey = `${lowestX + i},${lowestY < highestY ? lowestY + i : lowestY - i}`;
				if(board.has(iKey)) {
					board.set(iKey, board.get(iKey) + 1);
				} else {
					board.set(iKey, 1);
				}
			}
		}
	});

	// Do not repeat yourself? Could you repeat that?
	doubled = 0;
	highestX = 0;
	highestY = 0;
	board.forEach(function(val, key) {
		if(val >= 2) {
			doubled++;
		}
		let coord = key.split(",");
		if(+coord[0] > highestX) {
			highestX = +coord[0];
		}
		if(+coord[1] > highestY) {
			highestY = +coord[0];
		}
	});
	firstX = "~~~~";
	secondX = "~~~~";
	thirdX = "~~~~";
	for(let x = 0; x < highestX; x++) {
		if(x % 10 === 0) {
			firstX += Math.floor(x / 100);
			secondX += Math.floor(x % 100 / 10);
			thirdX += "0";
		} else {
			firstX += "_";
			secondX += "_";
			thirdX += "_";
		}
	}
	displayText(firstX);
	displayText(secondX);
	displayText(thirdX);
	displayText("~~~@".padEnd(highestX + 4, "@"));
	for(let y = 0; y < highestY; y++) {
		let toDisplay = y.toString() + "@";
		toDisplay = toDisplay.padStart(4, "0");
		for(let x = 0; x < highestX; x++) {
			let xYKey = `${x},${y}`;
			if(board.has(xYKey)) {
				if(board.get(xYKey) >= 10) console.warn(`Value of ${xYKey} is two or more digits long.`);
				toDisplay += board.get(xYKey);
			} else {
				toDisplay += ".";
			}
		}
		displayText(toDisplay);
	}
	displayText(`Overlap points \\/2: ${doubled}`);
}