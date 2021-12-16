"use strict";

function day15(input) {
	/*input = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;*/
	const FILE_REGEX = /\d+/gm;
	let chitons = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		chitons.push(entry[0].split("").map((e, ind) => new Square(+e, ind, chitons.length)));
	}

	function Square(chiton, posX, posY) {
		this.riskLevel = chiton;
		this.posX = posX;
		this.posY = posY;
		this.riskPath = new Map();
		this.minPath = new Map();
		this.onPath = new Map();
		this.lowPathTo = new Map();

		this.findPath = function(boundsCrossed) {
			if(boundsCrossed[0] === "L") boundsCrossed = boundsCrossed.slice(2);
			if(boundsCrossed[boundsCrossed.length - 1] === "U") {
				boundsCrossed = boundsCrossed.slice(0, boundsCrossed.length - 2);
			}
			if(this.onPath.has(boundsCrossed)) return;
			this.onPath.set(boundsCrossed, true);
			let rNeigh = chitons[this.posY][this.posX + 1] || false;
			let dNeigh = chitons[this.posY + 1] ? chitons[this.posY + 1][this.posX] : false;
			let lNeigh = chitons[this.posY][this.posX - 1] || false;
			let uNeigh = chitons[this.posY - 1] ? chitons[this.posY - 1][this.posX] : false;
			if(this.minPath.get(boundsCrossed) === "R") {
				if(!rNeigh) {
					chitons[this.posY][0].findPath("R" + boundsCrossed);
				} else {
					rNeigh.findPath(boundsCrossed);
				}
			} else if(this.minPath.get(boundsCrossed) === "D") {
				if(!dNeigh) {
					chitons[0][this.posX].findPath(boundsCrossed + "D");
				} else {
					dNeigh.findPath(boundsCrossed);
				}
			} else if(this.minPath.get(boundsCrossed) === "L") {
				if(!lNeigh) {
					chitons[this.posY][0].findPath("L" + boundsCrossed);
				} else {
					lNeigh.findPath(boundsCrossed);
				}
			} else if(this.minPath.get(boundsCrossed) === "U") {
				if(!uNeigh) {
					chitons[0][this.posX].findPath(boundsCrossed + "U");
				} else {
					uNeigh.findPath(boundsCrossed);
				}
			} else {
				return;
			}
		}

		this.getRiskOff = function(numCrossed) {
			return (this.riskLevel + numCrossed - 1) % 9 + 1;
		}

		this.calcRiskPath = function(boundsCrossed, igRep = false) {
			if(boundsCrossed[0] === "L") boundsCrossed = boundsCrossed.slice(2);
			if(boundsCrossed[boundsCrossed.length - 1] === "U") {
				boundsCrossed = boundsCrossed.slice(0, boundsCrossed.length - 2);
			} // The above lines are used only for the optimization efforts below.
			if(this.riskPath.has(boundsCrossed)) return this.riskPath.get(boundsCrossed);
			let cLen = chitons.length;
			let rowLen = chitons[0].length;
			let rNeigh = chitons[this.posY][mod(this.posX + 1, rowLen)];
			let dNeigh = chitons[mod(this.posY + 1, cLen)][this.posX];
			let numCross = igRep ? 0 : boundsCrossed.length;
			let numR = 0;
			let numD = 0;
			for(let i = 0; i < numCross; i++) {
				if(boundsCrossed[i] === "R") numR++;
				if(boundsCrossed[i] === "D") numD++;
			}

			let rWrap, rRisk;
			if((!igRep && numR !== 4) || this.posX + 1 !== rowLen) {
				rWrap = !igRep && (this.posX + 1 === rowLen) ? "R" : "";
				rRisk = rNeigh.calcRiskPath(rWrap + boundsCrossed, igRep) + 
						rNeigh.getRiskOff(numCross + +!!rWrap);
			}
			let dWrap, dRisk;
			if((!igRep && numD !== 4) || this.posY + 1 !== cLen) {
				dWrap = !igRep && (this.posY + 1 === cLen) ? "D" : "";
				dRisk = dNeigh.calcRiskPath(boundsCrossed + dWrap, igRep) + 
						dNeigh.getRiskOff(numCross + +!!dWrap);
			}
			if((igRep || (numR === 4 && numD === 4)) && 
				this.posX + 1 === rowLen && 
				this.posY + 1 === cLen) {

				this.riskPath.set(boundsCrossed, 0);
				this.minPath.set(boundsCrossed, " ");
				return 0;
			}
			let minRisk = typeof rRisk !== "undefined" ? rRisk : dRisk;
			if(typeof dRisk !== "undefined" && dRisk < minRisk) {
				minRisk = dRisk;
			}
			this.riskPath.set(boundsCrossed, minRisk);
			this.minPath.set(boundsCrossed, minRisk === rRisk ? "R" : "D");
			return this.riskPath.get(boundsCrossed);
		}
	}

	function mod(a, n) {
		return ((a % n) + n) % n;
	}

	displayText(`Min risk level: ${chitons[0][0].calcRiskPath("A", true)}`);
	chitons[0][0].calcRiskPath("", false);
	// OK, it's iterative optimization time.
	let optimized = false;
	let iterations = 1;
	while(!optimized) {
		optimized = true;
		let changes = 0;
		let maxChanges = 0;
		chitons.forEach(function(row) {
			row.forEach(function(square) {
				square.riskPath.forEach(function(risk, tile) {
					let cLen = chitons.length;
					let rowLen = row.length;
					let numR = 0;
					let numD = 0;
					for(let i = 0; i < tile.length; i++) {
						if(tile[i] === "R") numR++;
						if(tile[i] === "D") numD++;
					}
					let numCross = numR + numD;
					let rNeigh = chitons[square.posY][mod(square.posX + 1, rowLen)];
					let dNeigh = chitons[mod(square.posY + 1, cLen)][square.posX];
					let lNeigh = chitons[square.posY][mod(square.posX - 1, rowLen)];
					let uNeigh = chitons[mod(square.posY - 1, cLen)][square.posX];
					let rWrap, rRisk;
					if(numR !== 4 || square.posX + 1 !== rowLen) {
						rWrap = square.posX + 1 === rowLen ? "R" : "";
						rRisk = rNeigh.calcRiskPath(rWrap + tile) + 
								rNeigh.getRiskOff(numCross + +!!rWrap);
					}
					let dWrap, dRisk;
					if(numD !== 4 || square.posY + 1 !== cLen) {
						dWrap = square.posY + 1 === cLen ? "D" : "";
						dRisk = dNeigh.calcRiskPath(tile + dWrap) + 
								dNeigh.getRiskOff(numCross + +!!dWrap);
					}
					let uWrap, uRisk;
					if(numD !== 0 || square.posY !== 0) {
						uWrap = square.posY === 0 ? "U" : "";
						uRisk = uNeigh.calcRiskPath(tile + uWrap) + 
								uNeigh.getRiskOff(numCross + +!!uWrap);
					}
					let lWrap, lRisk;
					if(numR !== 0 || square.posX !== 0) {
						lWrap = square.posX === 0 ? "L" : "";
						lRisk = lNeigh.calcRiskPath(lWrap + tile) + 
								lNeigh.getRiskOff(numCross + +!!lWrap); // Janky!
					}
					let lowestRisk = rRisk;
					let lowestName = "R";
					if(dRisk < lowestRisk) {
						lowestRisk = dRisk;
						lowestName = "D";
					}
					if(uRisk < lowestRisk) {
						lowestRisk = uRisk;
						lowestName = "U";
					}
					if(lRisk < lowestRisk) {
						lowestRisk = lRisk;
						lowestName = "L";
					}
					if(risk > lowestRisk) {
						changes++;
						optimized = false;
						square.riskPath.set(tile, lowestRisk);
						square.minPath.set(tile, lowestName);
					}
				});
			});
		});
		if(iterations++ % 10 === 0) console.log(`Iteration ${iterations - 1}; Changes: ${changes}`);
	}
	displayText(`Min repRisk level: ${chitons[0][0].calcRiskPath("", false)}`);
	chitons[0][0].findPath("");
	for(let d = 0; d < 5; d++) {
		for(let i = 0; i < chitons.length; i++) {
			let toDisplay = "";
			for(let r = 0; r < 5; r++) {
				let borderCross = "".padStart(r, "R").padEnd(r + d, "D");
				toDisplay += chitons[i].reduce(function(acc, square) {
					if(square.onPath.has(borderCross)) {
						return acc + "█";
					} else {
						return acc + square.getRiskOff(r + d);
					}
				}, "");
				toDisplay += " ";
			}
			displayText(toDisplay);
		}
		displayText();
	}
}