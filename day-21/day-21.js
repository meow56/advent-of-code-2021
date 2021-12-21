"use strict";

function day21(input) {
	/*input = ``;/**/
	const FILE_REGEX = /: (\d+)/gm;
	let p1Pos = +(FILE_REGEX.exec(input)[1]);
	let p2Pos = +(FILE_REGEX.exec(input)[1]);
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
}