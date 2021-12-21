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
}