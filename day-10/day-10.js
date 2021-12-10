"use strict";

function day10(input) {
	/*input = ``;*/
	const FILE_REGEX = /(\(|\[|<|{|\)|\]|>|})+/gm;
	let lines = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		lines.push(entry[0]);
	}

	function isCorrupted(line, verbose, stackTrace) {
		let closeStack = [];
		for(let i = 0; i < line.length; i++) {
			switch(line[i]) {
				case "(":
					closeStack.push(")");
					break;
				case "[":
					closeStack.push("]");
					break;
				case "<":
					closeStack.push(">");
					break;
				case "{":
					closeStack.push("}");
					break;
				case ")":
				case "]":
				case ">":
				case "}":
					let expected = closeStack.pop();
					if(expected !== line[i]) {
						return verbose ? [expected, line[i]] : true;
					}
					break;
				default:
					throw `Expecting some grouping char but got ${line[i]}.`;
			}
		}
		return stackTrace ? closeStack : false;
	}

	let score = 0;
	lines.forEach(function(line, index) {
		let cor = isCorrupted(line, true, false);
		if(cor === false) {

		} else {
			displayText(`CorruptionError: Expected ${cor[0]} but got ${cor[1]} on line ${index + 1}.`);
			switch(cor[1]) {
				case ")":
					score += 3;
					break;
				case "]":
					score += 57;
					break;
				case ">":
					score += 25137;
					break;
				case "}":
					score += 1197;
					break;
			}
		}
	});
	displayText(`Score: ${score}`);
	updateCaption(`A long list of CorruptionErrors are shown,`);
	updateCaption(`specifying the expected, actual, and line number the error appears on.`);
	updateCaption(`The score is also shown: ${score}.`);

	lines = lines.filter(line => !isCorrupted(line, false, false));
	let autoScores = lines.map(function(line, index) {
		let autocomplete = isCorrupted(line, false, true);
		let toDisplay = "";
		let score = autocomplete.reduceRight(function(acc, char) {
			toDisplay += char;
			acc *= 5;
			switch(char) {
				case ")":
					return acc + 1;
					break;
				case "]":
					return acc + 2;
					break;
				case ">":
					return acc + 4;
					break;
				case "}":
					return acc + 3;
					break;
			}
		}, 0);
		displayText(`Warning: Line ${index + 1} is missing ${toDisplay}.`);
		return score;
	}).sort((a, b) => a - b);
	displayText(`Median score: ${autoScores[(autoScores.length - 1) / 2]}`);
	updateCaption(`A list of warnings are also shown, displaying`);
	updateCaption(`what lines (with corrupted lines removed) are missing what characters.`);
	updateCaption(`The autocomplete score is also shown: ${autoScores[(autoScores.length - 1) / 2]}`);
}