"use strict";

function day8(input) {
	//input = "";
	const FILE_REGEX = /((?:[a-g]+ )+)\|((?: [a-g]+)+)/gm;
	let digits = [];
	let outputs = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		digits.push(entry[1].trim().split(" "));
		outputs.push(entry[2].trim().split(" "));
	}

	let uniqueNums = 0;
	outputs.forEach(function(output) {
		output.forEach(function(display) {
			switch(display.length) {
				case 2: // 1
				case 4: // 4
				case 3: // 7
				case 7: // 8
					uniqueNums++;
					break;
				default:
					break;
			}
		});
	});
	displayText(`Number of 1, 4, 7, or 8: ${uniqueNums}`);
}