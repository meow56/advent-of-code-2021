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

	function gameplay(p1Score, p2Score, p1Pos, p2Pos, p1sTurn) {
		if(p1Score >= 21) return [1, 0];
		if(p2Score >= 21) return [0, 1];
		// 3, 4, 5, 6, 7, 8, 9
		// 1, 3, 6, 7, 6, 3, 1
		let pos3 = ((p1sTurn ? p1Pos : p2Pos) + 3 - 1) % 10 + 1;
		let pos4 = ((p1sTurn ? p1Pos : p2Pos) + 4 - 1) % 10 + 1;
		let pos5 = ((p1sTurn ? p1Pos : p2Pos) + 5 - 1) % 10 + 1;
		let pos6 = ((p1sTurn ? p1Pos : p2Pos) + 6 - 1) % 10 + 1;
		let pos7 = ((p1sTurn ? p1Pos : p2Pos) + 7 - 1) % 10 + 1;
		let pos8 = ((p1sTurn ? p1Pos : p2Pos) + 8 - 1) % 10 + 1;
		let pos9 = ((p1sTurn ? p1Pos : p2Pos) + 9 - 1) % 10 + 1;

		let p3Vic = gameplay(...(p1sTurn ? [p1Score + pos3, p2Score, pos3, p2Pos] : 
										   [p1Score, p2Score + pos3, p1Pos, pos3]), !p1sTurn);
		let p4Vic = gameplay(...(p1sTurn ? [p1Score + pos4, p2Score, pos4, p2Pos] : 
										   [p1Score, p2Score + pos4, p1Pos, pos4]), !p1sTurn);
		let p5Vic = gameplay(...(p1sTurn ? [p1Score + pos5, p2Score, pos5, p2Pos] : 
										   [p1Score, p2Score + pos5, p1Pos, pos5]), !p1sTurn);
		let p6Vic = gameplay(...(p1sTurn ? [p1Score + pos6, p2Score, pos6, p2Pos] : 
										   [p1Score, p2Score + pos6, p1Pos, pos6]), !p1sTurn);
		let p7Vic = gameplay(...(p1sTurn ? [p1Score + pos7, p2Score, pos7, p2Pos] : 
										   [p1Score, p2Score + pos7, p1Pos, pos7]), !p1sTurn);
		let p8Vic = gameplay(...(p1sTurn ? [p1Score + pos8, p2Score, pos8, p2Pos] : 
										   [p1Score, p2Score + pos8, p1Pos, pos8]), !p1sTurn);
		let p9Vic = gameplay(...(p1sTurn ? [p1Score + pos9, p2Score, pos9, p2Pos] : 
										   [p1Score, p2Score + pos9, p1Pos, pos9]), !p1sTurn);
		p4Vic = p4Vic.map(e => 3 * e);
		p5Vic = p5Vic.map(e => 6 * e);
		p6Vic = p6Vic.map(e => 7 * e);
		p7Vic = p7Vic.map(e => 6 * e);
		p8Vic = p8Vic.map(e => 3 * e);
		return [p3Vic[0] + p4Vic[0] + p5Vic[0] + p6Vic[0] + p7Vic[0] + p8Vic[0] + p9Vic[0],
				p3Vic[1] + p4Vic[1] + p5Vic[1] + p6Vic[1] + p7Vic[1] + p8Vic[1] + p9Vic[1]];
	}
	let mostWinners = Math.max(...gameplay(0, 0, p1Pos2, p2Pos2, true));
	displayText(`Most winners: ${mostWinners}`);
	updateCaption(`Part 1: ${losing * diceRolls}`);
	updateCaption(`Most winners: ${mostWinners}`);
}