"use strict";

function day9(input) {
	/*input = `2199943210
3987894921
9856789892
8767896789
9899965678`;*/
	const FILE_REGEX = /\d+/gm;
	let heights = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		heights.push(entry[0].split("").map(num => +num));
	}
	let isLowPoint = [];
	for(let i = 0; i < heights.length; i++) {
		isLowPoint[i] = new Array(heights[0].length);
	}

	let risk = 0;
	heights.forEach(function(row, rI) {
		row.forEach(function(height, hI) {
			isLowPoint[rI][hI] = false;
			if(rI === 0) {
				if(hI === 0) {
					// Living on the edge... or rather, the top left corner.
					if(row[hI + 1] > height && 			// right
					   heights[rI + 1][hI] > height) {	// down
						risk += height + 1;
						isLowPoint[rI][hI] = true;
					}
				} else if(hI + 1 === row.length) {
					// Living on the top RIGHT corner now.
					if(row[hI - 1] > height && 			// left
					   heights[rI + 1][hI] > height) {	// down
						risk += height + 1;
						isLowPoint[rI][hI] = true;
					}
				} else {
					// Living on the top edge.
					if(row[hI + 1] > height && 			// right
					   row[hI - 1] > height && 			// left
					   heights[rI + 1][hI] > height) {	// down
						risk += height + 1;
						isLowPoint[rI][hI] = true;
					}
				}
			} else if(rI + 1 === heights.length) {
				if(hI === 0) {
					// Living on the bottom left corner.
					if(row[hI + 1] > height && 			// right
					   heights[rI - 1][hI] > height) {	// up
						risk += height + 1;
						isLowPoint[rI][hI] = true;
					}
				} else if(hI + 1 === row.length) {
					// Living on the bottom right corner.
					if(row[hI - 1] > height && 			// left
					   heights[rI - 1][hI] > height) {	// up
						risk += height + 1;
						isLowPoint[rI][hI] = true;
					}
				} else {
					// Living on the bottom edge.
					if(row[hI + 1] > height && 			// right
					   row[hI - 1] > height && 			// left
					   heights[rI - 1][hI] > height) {	// up
						risk += height + 1;
						isLowPoint[rI][hI] = true;
					}
				}
			} else {
				if(hI === 0) {
					// Living on the edge, the left one to be precise.
					if(row[hI + 1] > height && 			// right
					   heights[rI - 1][hI] > height &&	// up
					   heights[rI + 1][hI] > height) {	// down
						risk += height + 1;
						isLowPoint[rI][hI] = true;
					}
				} else if(hI + 1 === row.length) {
					// Living on the right edge.
					if(row[hI - 1] > height && 			// left
					   heights[rI - 1][hI] > height &&	// up
					   heights[rI + 1][hI] > height) {	// down
						risk += height + 1;
						isLowPoint[rI][hI] = true;
					}
				} else {
					// You're in the middle of the ride...
					if(row[hI + 1] > height && 			// right
					   row[hI - 1] > height && 			// left
					   heights[rI - 1][hI] > height &&	// up
					   heights[rI + 1][hI] > height) {	// down
						risk += height + 1;
						isLowPoint[rI][hI] = true;
					}
				}
			}
		});
	});
	displayText(`Total risk: ${risk}.`);

	function detBasin(rI, hI) {
		let pOI = heights[rI][hI]; // point of interest
		let row = heights[rI];
		if(pOI === 9) return false; // not in a basin
		if(isLowPoint[rI][hI]) return [rI, hI];
		if(rI === 0) {
			if(hI === 0) {
				// Living on the edge... or rather, the top left corner.
				let lowVal = 10;
				let lowInds = [];
				if(heights[rI][hI + 1] < lowVal) {
					// right
					lowVal = heights[rI][hI + 1];
					lowInds = [rI, hI + 1];
				}
				if(heights[rI + 1][hI] < lowVal) {
					// down
					lowVal = heights[rI + 1][hI];
					lowInds = [rI + 1, hI];
				}
				return detBasin(lowInds[0], lowInds[1]);
			} else if(hI + 1 === row.length) {
				// Living on the top RIGHT corner now.
				let lowVal = 10;
				let lowInds = [];
				if(heights[rI][hI - 1] < lowVal) {
					// left
					lowVal = heights[rI][hI - 1];
					lowInds = [rI, hI - 1];
				}
				if(heights[rI + 1][hI] < lowVal) {
					// down
					lowVal = heights[rI + 1][hI];
					lowInds = [rI + 1, hI];
				}
				return detBasin(lowInds[0], lowInds[1]);
			} else {
				// Living on the top edge.
				let lowVal = 10;
				let lowInds = [];
				if(heights[rI][hI + 1] < lowVal) {
					// right
					lowVal = heights[rI][hI + 1];
					lowInds = [rI, hI + 1];
				}
				if(heights[rI][hI - 1] < lowVal) {
					// left
					lowVal = heights[rI][hI - 1];
					lowInds = [rI, hI - 1];
				}
				if(heights[rI + 1][hI] < lowVal) {
					// down
					lowVal = heights[rI + 1][hI];
					lowInds = [rI + 1, hI];
				}
				return detBasin(lowInds[0], lowInds[1]);
			}
		} else if(rI + 1 === heights.length) {
			if(hI === 0) {
				// Living on the bottom left corner.
				let lowVal = 10;
				let lowInds = [];
				if(heights[rI][hI + 1] < lowVal) {
					// right
					lowVal = heights[rI][hI + 1];
					lowInds = [rI, hI + 1];
				}
				if(heights[rI - 1][hI] < lowVal) {
					// up
					lowVal = heights[rI - 1][hI];
					lowInds = [rI - 1, hI];
				}
				return detBasin(lowInds[0], lowInds[1]);
			} else if(hI + 1 === row.length) {
				// Living on the bottom right corner.
				let lowVal = 10;
				let lowInds = [];
				if(heights[rI][hI - 1] < lowVal) {
					// left
					lowVal = heights[rI][hI - 1];
					lowInds = [rI, hI - 1];
				}
				if(heights[rI - 1][hI] < lowVal) {
					// up
					lowVal = heights[rI - 1][hI];
					lowInds = [rI - 1, hI];
				}
				return detBasin(lowInds[0], lowInds[1]);
			} else {
				// Living on the bottom edge.
				let lowVal = 10;
				let lowInds = [];
				if(heights[rI][hI + 1] < lowVal) {
					// right
					lowVal = heights[rI][hI + 1];
					lowInds = [rI, hI + 1];
				}
				if(heights[rI][hI - 1] < lowVal) {
					// left
					lowVal = heights[rI][hI - 1];
					lowInds = [rI, hI - 1];
				}
				if(heights[rI - 1][hI] < lowVal) {
					// up
					lowVal = heights[rI - 1][hI];
					lowInds = [rI - 1, hI];
				}
				return detBasin(lowInds[0], lowInds[1]);
			}
		} else {
			if(hI === 0) {
				// Living on the edge, the left one to be precise.
				let lowVal = 10;
				let lowInds = [];
				if(heights[rI][hI + 1] < lowVal) {
					// right
					lowVal = heights[rI][hI + 1];
					lowInds = [rI, hI + 1];
				}
				if(heights[rI - 1][hI] < lowVal) {
					// up
					lowVal = heights[rI - 1][hI];
					lowInds = [rI - 1, hI];
				}
				if(heights[rI + 1][hI] < lowVal) {
					// down
					lowVal = heights[rI + 1][hI];
					lowInds = [rI + 1, hI];
				}
				return detBasin(lowInds[0], lowInds[1]);
			} else if(hI + 1 === row.length) {
				// Living on the right edge.
				let lowVal = 10;
				let lowInds = [];
				if(heights[rI][hI - 1] < lowVal) {
					// left
					lowVal = heights[rI][hI - 1];
					lowInds = [rI, hI - 1];
				}
				if(heights[rI - 1][hI] < lowVal) {
					// up
					lowVal = heights[rI - 1][hI];
					lowInds = [rI - 1, hI];
				}
				if(heights[rI + 1][hI] < lowVal) {
					// down
					lowVal = heights[rI + 1][hI];
					lowInds = [rI + 1, hI];
				}
				return detBasin(lowInds[0], lowInds[1]);
			} else {
				// You're in the middle of the ride...
				let lowVal = 10;
				let lowInds = [];
				if(heights[rI][hI + 1] < lowVal) {
					// right
					lowVal = heights[rI][hI + 1];
					lowInds = [rI, hI + 1];
				}
				if(heights[rI][hI - 1] < lowVal) {
					// left
					lowVal = heights[rI][hI - 1];
					lowInds = [rI, hI - 1];
				}
				if(heights[rI - 1][hI] < lowVal) {
					// up
					lowVal = heights[rI - 1][hI];
					lowInds = [rI - 1, hI];
				}
				if(heights[rI + 1][hI] < lowVal) {
					// down
					lowVal = heights[rI + 1][hI];
					lowInds = [rI + 1, hI];
				}
				return detBasin(lowInds[0], lowInds[1]);
			}
		}
	}


	let basins = [];
	for(let i = 0; i < heights.length; i++) {
		basins[i] = new Array(heights[0].length);
	}

	let basinSizes = new Map();
	heights.forEach(function(row, rI) {
		row.forEach(function(height, hI) {
			basins[rI][hI] = detBasin(rI, hI);
			let mapKey = detBasin(rI, hI).toString();
			if(mapKey !== "false") {
				if(basinSizes.has(mapKey)) {
					basinSizes.set(mapKey, basinSizes.get(mapKey) + 1);
				} else {
					basinSizes.set(mapKey, 1);
				}
			}
		});
	});

	const TILEMAP = [
		" ",
		"░",
		"░",
		"▒",
		"▒",
		"▒",
		"▓",
		"▓",
		"▓",
		"█",
	]
	for(let i = 0; i < heights.length; i++) {
		let toDisplay = "";
		for(let j = 0; j < heights[i].length; j++) {
			toDisplay += TILEMAP[heights[i][j]];
		}
		displayText(toDisplay);
	}

	let large1 = 0;
	let large2 = 0;
	let large3 = 0;
	let l1K = -1;
	let l2K = -1;
	let l3K = -1;
	let prevLarge1 = 1;
	let prevLarge2 = 1;
	let prevLarge3 = 1;
	//let numLeft = basinSizes.size;

	while(prevLarge1 !== large1 || prevLarge2 !== large2 || prevLarge3 !== large3) {
		prevLarge1 = large1;
		prevLarge2 = large2;
		prevLarge3 = large3;

		basinSizes.forEach(function(size, key) {
			if(size > large1 && key !== l2K && key !== l3K) {
				large1 = size;
				l1K = key;
			} else if(size > large2 && key !== l1K && key !== l3K) {
				large2 = size;
				l2K = key;
			} else if(size > large3 && key !== l2K && key !== l1K) {
				large3 = size;
				l3K = key;
			}
		});
	}
	displayText(`Basin mult: ${large1 * large2 * large3}`);

	updateCaption(`A map of the cave is presented. Lighter shades represent`);
	updateCaption(`a lower elevation, and darker for a higher elevation.`);
	updateCaption(`The solutions are also displayed:`);
	updateCaption(`Total risk: ${risk}.`);
	updateCaption(`Basin mult: ${large1 * large2 * large3}.`);
}