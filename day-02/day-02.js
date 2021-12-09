"use strict";

function day2(input) {
	const FILE_REGEX = /((?:forward)|(?:down)|(?:up)) (\d)/g;
	let inst = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		inst.push([entry[1], +entry[2]]);
		// ["forward" or "down" or "up", int]
	}

	let dist = 0; // modified by forward
	let depth = 0; // modified by up and down
	let subPos = [];
	let highDist = 0;
	let lowDepth = 0;

	inst.forEach(function(elem) {
		switch(elem[0]) {
			case "forward":
				dist += elem[1];
				highDist = dist;
				break;
			case "down":
				depth += elem[1];
				if (depth > lowDepth) {
					lowDepth = depth;
				}
				break;
			case "up":
				depth -= elem[1];
				break;
		}
		if(depth < 0) throw "Flying submarine";
		subPos.push([dist, depth]);
	});
	displayText(`Horizontal: ${dist}`);
	displayText(`Depth:      ${depth}`);
	displayText(`Mult:       ${dist * depth}`);
	let p1Dist = dist;
	let p1Depth = depth;


	const POINT = "O";
	const VERT_CHAR = "│";
	const VERT2_CHAR = "║";
	const HORIZ_CHAR = "─";
	const HORIZ2_CHAR = "═";
	const CROSS_CHAR = "┼";
	const DIAG_DOWN_CHAR = "\\";

	function displayGraph() {
		if(lowDepth > 1000) {
			lowDepth = 1000;
		}
		let toDisplay = [];
		for(let i = 0; i <= lowDepth; i++) {
			toDisplay[i] = "";
			if(i === 0) {
				toDisplay[i] = toDisplay[i].padStart(highDist, "~").split("");
			} else {
				toDisplay[i] = toDisplay[i].padStart(highDist, " ").split("");
			}
		}

		function replaceChar(depthInd, distInd, char) {
			if(depthInd > 1000) return;
			let toReplace = toDisplay[depthInd][distInd];
			if(char === POINT) {
				toDisplay[depthInd][distInd] = char;
				return;
			}
			switch(toReplace) {
				case POINT:
				case VERT2_CHAR:
					return;
					break;
				case " ":
				case "~":
					toDisplay[depthInd][distInd] = char;
					break;
				case VERT_CHAR:
					switch(char) {
						case VERT_CHAR:
							toDisplay[depthInd][distInd] = VERT2_CHAR;
							break;
						case HORIZ_CHAR:
							toDisplay[depthInd][distInd] = CROSS_CHAR;
							break;
						case DIAG_DOWN_CHAR:
							break;
						default:
							throw `char is "${char}"`;
					}
					break;
				case HORIZ_CHAR:
					switch(char) {
						case VERT_CHAR:
							toDisplay[depthInd][distInd] = CROSS_CHAR;
							break;
						case HORIZ_CHAR:
							toDisplay[depthInd][distInd] = HORIZ2_CHAR;
							break;
						case DIAG_DOWN_CHAR:
							break;
						default:
							throw `char is "${char}"`;
					}
					break;
				case DIAG_DOWN_CHAR:
					switch(char) {
						case VERT_CHAR:
							toDisplay[depthInd][distInd] = CROSS_CHAR;
							break;
						case HORIZ_CHAR:
							toDisplay[depthInd][distInd] = HORIZ2_CHAR;
							break;
						case DIAG_DOWN_CHAR:
							break;
						default:
							throw `char is "${char}"`;
					}
					break;
				default:
					throw `toReplace is "${toReplace}"`;
			}
		}


		subPos.forEach(function(point, index, arr) {
			console.log(`Currently on ${index} of ${arr.length}`);
			replaceChar(point[1], point[0], POINT);
			if(subPos.length !== index + 1) {
				// it's not the last one
				let diffDist = arr[index + 1][0] - point[0];
				let diffDep = arr[index + 1][1] - point[1];
				if(diffDist === 0) {
					if(diffDep > 0) {
						for(let i = 1; i < diffDep; i++) {
							replaceChar(point[1] + i, point[0], VERT_CHAR);
						}
					} else {
						for(let i = 1; i < Math.abs(diffDep); i++) {
							replaceChar(point[1] - i, point[0], VERT_CHAR);
						}
					}
				} else if(diffDep === 0) {
					// diffDist is always positive since forward always has positive args.
					for(let i = 1; i < diffDist; i++) {
						replaceChar(point[1], point[0] + i, HORIZ_CHAR);
					}
				} else {
					// Then we're going forward and down.
					// We'll never be going up since aim will always be positive
					// (since the depth was always positive.)
					for(let i = 0; i <= diffDist; i++) {
						replaceChar(point[1] + i * diffDep / diffDist, point[0] + i, DIAG_DOWN_CHAR);
						for(let j = i * diffDep / diffDist + 1; i + 1 <= diffDist && j < (i + 1) * diffDep / diffDist; j++) {
							replaceChar(point[1] + j, point[0] + i, VERT_CHAR);
						}
					}
				}
			}
		});
		console.log(`Almost done, now printing ${toDisplay.length} lines.`);
		for(let i = 0; i < toDisplay.length; i++) {
			displayText(toDisplay[i].join(""));
		}
	}
	displayGraph();

	dist = 0; // still modified by forward
	depth = 0; // now also modified by forward
	let aim = 0; // modified by down and up
	subPos = [];
	highDist = 0;
	lowDepth = 0;

	inst.forEach(function(elem) {
		switch(elem[0]) {
			case "forward":
				dist += elem[1];
				depth += elem[1] * aim;
				highDist = dist;
				lowDepth = depth;
				subPos.push([dist, depth]);
				break;
			case "down":
				aim += elem[1];
				break;
			case "up":
				aim -= elem[1];
				break;
		}
		if(depth < 0) throw "Flying submarine";
	});
	displayText(`True horizontal: ${dist}`);
	displayText(`True depth:      ${depth}`);
	displayText(`True mult:       ${dist * depth}`);
	console.log(highDist);
	console.log(lowDepth);
	displayGraph();
	updateCaption(`Two graphs are shown; the top one displays the route taken`);
	updateCaption(`by part 1, the bottom showing the route taken by part 2`);
	updateCaption(`for depths 0-1000. There is also the horizontal and vertical`);
	updateCaption(`positions of the final location, as well as their product:`);
	updateCaption(`Part 1: Horizontal ${p1Dist}, Depth ${p1Depth}, Product ${p1Dist * p1Depth}`);
	updateCaption(`Part 2: Horizontal ${dist}, Depth ${depth}, Product ${dist * depth}`);
}