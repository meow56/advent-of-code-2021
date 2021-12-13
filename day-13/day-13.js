"use strict";

function day13(input) {
	/*input = ``;*/
	const FILE_REGEX = /(\d+,\d+)|(?:fold along (x|y)=(\d+))/gm;
	let points = [];
	let folds = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		if(typeof entry[1] !== "undefined") {
			points.push(entry[1].split(",").map(e => +e));
		} else {
			folds.push([entry[2], +entry[3]]);
		}
	}

	let highestX = 0;
	let highestY = 0;
	for(let i = 0; i < points.length; i++) {
		if(points[i][0] > highestX) highestX = points[i][0];
		if(points[i][1] > highestY) highestY = points[i][1];
	}

	let paper = [];
	for(let i = 0; i <= highestY; i++) {
		paper.push("".padStart(highestX + 1, ".").split(""));
	}

	points.forEach(function(point) {
		paper[point[1]][point[0]] = "█";
	});

	paper.forEach(function(row) {
		displayText(row.join(""));
	});

	folds.forEach(function(fold, fI) {
		if(fold[0] === "x") {
			let toFold = paper.map(function(line) {
				return line.filter((e, ind) => ind > fold[1]).reverse();
			});
			let unfolded = paper.map(function(line) {
				return line.filter((e, ind) => ind < fold[1]);
			});
			toFold.forEach(function(row, rI) {
				row.forEach(function(point, pI) {
					if(point === "█") {
						unfolded[rI][pI] = "█";
					}
				});
			});
			paper = unfolded;
		} else if(fold[0] === "y") {
			let toFold = paper.filter((line, lI) => lI > fold[1]);
			let unfolded = paper.filter((line, lI) => lI < fold[1]);
			toFold.forEach(function(row, rI) {
				row.reverse();
				row.forEach(function(point, pI) {
					if(point === "█") {
						unfolded[rI][pI] = "█";
					}
				});
			});
			paper = unfolded;
		} else {
			throw `Not folding along x or y`;
		}

		displayText(`After fold ${fI + 1}:`);
		paper.forEach(function(row) {
			displayText(row.join(""));
		});
		if(fI === 0) {
			let dotCount = paper.reduce(function(acc, row) {
				let rowSum = row.reduce(function(rAcc, point) {
					return rAcc + (point === "█" ? 1 : 0);
				}, 0);
				return acc + rowSum;
			}, 0);
			displayText(`Visible points after first fold: ${dotCount}`);
			throw `Getting ahead of ourselves!`;
		}
	});
}