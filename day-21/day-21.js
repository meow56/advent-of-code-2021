"use strict";

function day21(input) {
	/*input = ``;/**/
	// too high: 83281928890839420
	const FILE_REGEX = /: (\d+)/gm;
	let p1Pos = +(FILE_REGEX.exec(input)[1]);
	let p2Pos = +(FILE_REGEX.exec(input)[1]);
	let p1Pos2 = p1Pos;
	let p2Pos2 = p2Pos;
	let p1Score = 0;
	let p2Score = 0;

	let dice = 1;
	let diceRolls = 0;
	let p1sTurn = true;
	while(p1Score < 1000 && p2Score < 1000) {
		let totalMove = 0;
		totalMove += dice;
		dice = dice % 100 + 1;
		totalMove += dice;
		dice = dice % 100 + 1;
		totalMove += dice;
		dice = dice % 100 + 1;
		diceRolls += 3;
		if(p1sTurn) {
			p1Pos = (p1Pos - 1 + totalMove) % 10 + 1;
			p1Score += p1Pos;
			p1sTurn = false;
		} else {
			p2Pos = (p2Pos - 1 + totalMove) % 10 + 1;
			p2Score += p2Pos;
			p1sTurn = true;
		}
	}

	let losing = p1Score >= 1000 ? p2Score : p1Score;
	displayText(`Part 1: ${losing * diceRolls}`);

	const FREQS = [0, 0, 0, 1, 3, 6, 7, 6, 3, 1];
	let scores = new Map();
	function gameplay(p1Score, p2Score, p1Pos, p2Pos, p1sTurn) {
		if(p1Score >= 21) return [1, 0];
		if(p2Score >= 21) return [0, 1];
		// 3, 4, 5, 6, 7, 8, 9
		// 1, 3, 6, 7, 6, 3, 1
		if(scores.has(`${p1Score},${p2Score},${p1Pos},${p2Pos},${p1sTurn}`)) {
			return scores.get(`${p1Score},${p2Score},${p1Pos},${p2Pos},${p1sTurn}`);
		}

		let victories = [];
		if(p1sTurn) {
			for(let i = 3; i <= 9; i++) {
				let dist = (p1Pos + i - 1) % 10 + 1;
				victories[i] = gameplay(p1Score + dist, p2Score,
										dist, p2Pos, false).map(e => e * FREQS[i]);
			}
		} else {
			for(let i = 3; i <= 9; i++) {
				let dist = (p2Pos + i - 1) % 10 + 1;
				victories[i] = gameplay(p1Score, p2Score + dist,
										p1Pos, dist, true).map(e => e * FREQS[i]);
			}
		}
		scores.set(`${p1Score},${p2Score},${p1Pos},${p2Pos},${p1sTurn}`, 
			victories.reduce(function(acc, wins) {
				return [acc[0] + wins[0], acc[1] + wins[1]];
			}, [0, 0]));
		return victories.reduce(function(acc, wins) {
			return [acc[0] + wins[0], acc[1] + wins[1]];
		}, [0, 0]);
	}
	let mostWinners = Math.max(...gameplay(0, 0, p1Pos2, p2Pos2, true));
	displayText(`Most winners: ${mostWinners}`);
	updateCaption(`Part 1: ${losing * diceRolls}`);
	updateCaption(`Most winners: ${mostWinners}`);

	function roll() {
		if(!this.currentlyRolling) {
			this.currentlyRolling = true;
			this.boards.clearText();
			let toAdd = [];
			for(let i = 0; i < this.currBoards.length; i++) {
				let currState = this.currBoards[i];
				if(currState[0] >= 21) {
					this.currTotal[0] += currState[5];
					this.finishedBoards.set(currState.slice(0, -2).join(","), [1, 0]);
					this.currBoards.splice(i, 1);
					i--;
					continue;
				}
				if(currState[1] >= 21) {
					this.currTotal[1] += currState[5];
					this.finishedBoards.set(currState.slice(0, -2).join(","), [0, 1]);
					this.currBoards.splice(i, 1);
					i--;
					continue;
				}
			}
			let currState = this.currBoards[0]; // DFS
			let thisAdd = [];
			let totals = [0, 0];
			for(let j = 3; j <= 9; j++) {
				if(currState[4]) {
					let moveTo = (currState[2] + j - 1) % 10 + 1;
					let potential = [currState[0] + moveTo, 
									 currState[1], 
									 moveTo, 
									 currState[3], 
									 false, 
									 currState[5] * this.freqs[j],
									 currState[6] + 1];
					if(!this.finishedBoards.has(potential.slice(0, -2).join(","))) {
						thisAdd.push(potential);
					} else {
						totals[0] += this.finishedBoards.get(potential.slice(0, -2).join(","))[0];
						totals[1] += this.finishedBoards.get(potential.slice(0, -2).join(","))[1];
					}
				} else {
					let moveTo = (currState[3] + j - 1) % 10 + 1;
					let potential = [currState[0], 
									 currState[1] + moveTo, 
									 currState[2], 
									 moveTo, 
									 true, 
									 currState[5] * this.freqs[j],
									 currState[6] + 1];
					if(!this.finishedBoards.has(potential.slice(0, -2).join(","))) {
						thisAdd.push(potential);
					} else {
						totals[0] += this.finishedBoards.get(potential.slice(0, -2).join(","))[0];
						totals[1] += this.finishedBoards.get(potential.slice(0, -2).join(","))[1];
					}
				}
			}
			if(thisAdd.length === 0) {
				this.currTotal[0] += totals[0] * currState[5];
				this.currTotal[1] += totals[1] * currState[5];
				this.finishedBoards.set(currState.slice(0, -2).join(","), totals);
				this.currBoards.splice(0, 1);
			} else {
				toAdd.push(thisAdd);
			}
			toAdd = toAdd.flat();
			this.currBoards.splice(0, 0, ...toAdd);
			this.boards.displayText(`Total wins:`);
			this.boards.displayText(`P1: ${this.currTotal[0]}`);
			this.boards.displayText(`P2: ${this.currTotal[1]}`);
			for(let i = 0; i < this.currBoards.length; i++) {
				let currState = this.currBoards[i];
				// 01  02  03  04 
				// 10          05
				// 09  08  07  06
				this.boards.displayText(`Turn ${currState[6]}, P${+!currState[4] + 1}'s turn`);
				let toDisplay = " 01  02  03  04 ".split("");
				if(currState[2] <= 4) toDisplay[(currState[2] - 1) * 4] = "~";
				if(currState[3] <= 4) toDisplay[currState[3] * 4 - 1] = "~";
				toDisplay = toDisplay.join("");
				toDisplay += ` P1: ${(currState[0]).toString().padStart(2, " ")} [`;
				for(let i = 0; i < Math.min(currState[0], 21); i++) {
					toDisplay += "█";
				}
				for(let i = currState[0]; i < 21; i++) {
					toDisplay += " ";
				}
				toDisplay += "]";
				this.boards.displayText(toDisplay);
				toDisplay = " 10          05 ".split("");
				if(currState[2] ===  5) toDisplay[12] = "~";
				if(currState[2] === 10) toDisplay[0] = "~";
				if(currState[3] ===  5) toDisplay[15] = "~";
				if(currState[3] === 10) toDisplay[3] = "~";
				toDisplay = toDisplay.join("");
				toDisplay += ` * ${currState[5]}`;
				this.boards.displayText(toDisplay);
				toDisplay = " 09  08  07  06 ".split("");
				if(currState[2] <= 9 && currState[2] >= 6) toDisplay[(9 - currState[2]) * 4] = "~";
				if(currState[3] <= 9 && currState[3] >= 6) toDisplay[(10 - currState[3]) * 4 - 1] = "~";
				toDisplay = toDisplay.join("");
				toDisplay += ` P2: ${(currState[1]).toString().padStart(2, " ")} [`;
				for(let i = 0; i < Math.min(currState[1], 21); i++) {
					toDisplay += "█";
				}
				for(let i = currState[1]; i < 21; i++) {
					toDisplay += " ";
				}
				toDisplay += "]";
				this.boards.displayText(toDisplay);
				this.boards.displayText();
			}
			this.currentlyRolling = false;
		}
	}
	roll.boards = assignBlock("boards");
	roll.currBoards = [[0, 0, p1Pos2, p2Pos2, true, 1, 1]];
	roll.finishedBoards = new Map();
	roll.freqs = [0, 0, 0, 1, 3, 6, 7, 6, 3, 1];
	roll.currTotal = [0, 0];

	let currState = roll.currBoards[0];
	roll.boards.displayText(`Total wins:`);
	roll.boards.displayText(`P1: 0`);
	roll.boards.displayText(`P2: 0`);
	roll.boards.displayText(`Turn ${currState[6]}, P${+!currState[4] + 1}'s turn`);
	let toDisplay = " 01  02  03  04 ".split("");
	if(currState[2] <= 4) toDisplay[(currState[2] - 1) * 4] = "~";
	if(currState[3] <= 4) toDisplay[currState[3] * 4 - 1] = "~";
	toDisplay = toDisplay.join("");
	toDisplay += ` P1:  ${currState[0]} [`;
	for(let i = 0; i < currState[0]; i++) {
		toDisplay += "█";
	}
	for(let i = currState[0]; i < 21; i++) {
		toDisplay += " ";
	}
	toDisplay += "]";
	roll.boards.displayText(toDisplay);
	toDisplay = " 10          05 ".split("");
	if(currState[2] ===  5) toDisplay[12] = "~";
	if(currState[2] === 10) toDisplay[0] = "~";
	if(currState[3] ===  5) toDisplay[15] = "~";
	if(currState[3] === 10) toDisplay[3] = "~";
	toDisplay = toDisplay.join("");
	toDisplay += ` * ${currState[5]}`;
	roll.boards.displayText(toDisplay);
	toDisplay = " 09  08  07  06 ".split("");
	if(currState[2] <= 9 && currState[2] >= 6) toDisplay[(9 - currState[2]) * 4] = "~";
	if(currState[3] <= 9 && currState[3] >= 6) toDisplay[(10 - currState[3]) * 4 - 1] = "~";
	toDisplay = toDisplay.join("");
	toDisplay += ` P2:  ${currState[1]} [`;
	for(let i = 0; i < currState[1]; i++) {
		toDisplay += "█";
	}
	for(let i = currState[1]; i < 21; i++) {
		toDisplay += " ";
	}
	toDisplay += "]";
	roll.boards.displayText(toDisplay);
	roll.boards.displayText();
	assignButton(roll.bind(roll), "Roll");
}