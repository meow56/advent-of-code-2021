"use strict";

function day13(input) {
	/*input = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;*/
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

	let paperCache = [];
	function getFoldPaper(foldNum) {
		if(paperCache[foldNum]) return paperCache[foldNum];
		let prevFold = foldNum === 0 ? paper.slice() : getFoldPaper(foldNum - 1);
		let fold = folds[foldNum];
		if(fold[0] === "x") {
			let toFold = prevFold.map(function(line) {
				return line.filter((e, ind) => ind > fold[1]).reverse();
			});
			let unfolded = prevFold.map(function(line) {
				return line.filter((e, ind) => ind < fold[1]);
			});
			while(toFold[0].length < unfolded[0].length) {
				toFold = toFold.map(function(row) {
					return row.reverse().push(".").reverse();
				});
			}
			while(toFold[0].length > unfolded[0].length) {
				unfolded = unfolded.map(function(row) {
					return row.reverse().push(".").reverse();
				});
			}
			toFold.forEach(function(row, rI) {
				row.forEach(function(point, pI) {
					if(point === "█") {
						unfolded[rI][pI] = "█";
					}
				});
			});
			prevFold = unfolded;
		} else if(fold[0] === "y") {
			let toFold = prevFold.filter((line, lI) => lI > fold[1]);
			let unfolded = prevFold.filter((line, lI) => lI < fold[1]);
			while(toFold.length < unfolded.length) {
				toFold.push("".padStart(prevFold[0].length, ".").split(""));
			}
			while(toFold.length > unfolded.length) {
				unfolded.reverse().push("".padStart(prevFold[0].length, ".").split("")).reverse();
			}
			toFold.reverse();
			toFold.forEach(function(row, rI) {
				row.forEach(function(point, pI) {
					if(point === "█") {
						unfolded[rI][pI] = "█";
					}
				});
			});
			prevFold = unfolded;
		} else {
			throw `Not folding along x or y`;
		}
		paperCache[foldNum] = prevFold;
		return prevFold;
	}

	function displasyncPaper(block) {
		console.time(block.id);
		block.displayText(`After ${block.id}`);
		getFoldPaper(block.toDisplay).forEach(function(row) {
			block.displayText(row.join(""));
		});
		console.timeEnd(block.id);
	}

	folds.forEach(function(fold, fI) {
		let thisBlock = assignBlock(`fold ${fI + 1}`);
		thisBlock.toDisplay = fI;
		setTimeout(displasyncPaper, 0, thisBlock);
	});

	let dotCount = getFoldPaper(0).reduce(function(acc, row) {
		let rowSum = row.reduce(function(rAcc, point) {
			return rAcc + (point === "█" ? 1 : 0);
		}, 0);
		return acc + rowSum;
	}, 0);
	displayText(`Visible points after first fold: ${dotCount}`);
	updateCaption(`The number of visible points after the first fold is shown: ${dotCount}`);
	updateCaption(`Following this are many grids containing . and █`);
	updateCaption(`Every successive grid represents the paper after a fold.`);
	updateCaption(`The last one displays the letters that make up part 2's solution.`);
	updateCaption(`Unfortunately, I don't know what it says. Sorry.`);
	updateCaption(`If you're using the input provided in the repo, then the answer is PGHZBFJC.`);
}