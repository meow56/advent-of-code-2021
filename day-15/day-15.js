"use strict";

function day15(input) {
	/*input = ``;*/
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
		this.riskPath;

		this.calcRiskPath = function() {
			if(this.riskPath) return this.riskPath;
			let rNeigh = chitons[this.posY][this.posX + 1] || false;
			let dNeigh = chitons[this.posY + 1] ? chitons[this.posY + 1][this.posX] : false;
			if(!rNeigh && !dNeigh) {
				// the end!
				this.riskPath = 0;
				return 0;
			} else if(!rNeigh) {
				// we're on the right edge
				this.riskPath = dNeigh.calcRiskPath() + dNeigh.riskLevel;
				return this.riskPath;
			} else if(!dNeigh) {
				// we're on the bottom edge
				this.riskPath = rNeigh.calcRiskPath() + rNeigh.riskLevel;
				return this.riskPath;
			} else {
				// somewhere else
				let rRisk = rNeigh.calcRiskPath() + rNeigh.riskLevel;
				let dRisk = dNeigh.calcRiskPath() + dNeigh.riskLevel;
				this.riskPath = Math.min(rRisk, dRisk);
				return this.riskPath;
			}
		}
	}

	displayText(`Min risk level: ${chitons[0][0].calcRiskPath()}`);
}