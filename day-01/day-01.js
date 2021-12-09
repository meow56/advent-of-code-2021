"use strict";

function day1(input) {
	const FILE_REGEX = /\b\d+\b/g;
	let numbers = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		numbers.push(+entry);
	}

	let result = numbers.filter(function(elem, ind) {
		return (ind !== 0) && (elem > numbers[ind - 1]);
		// Take advantage of short-circuiting!
	});
	displayText(`Number of depth increases: ${result.length}`);

	let result2 = numbers.filter(function(elem, ind) {
		return (ind > 2) && (elem > numbers[ind - 3]);
		// Since the middle two numbers stay the same between consecutive sums
		// we just have to check whether the current number is larger
		// than the one three behind it.
		/* A
		 * A B <- the same!
		 * A B <- the same!
		 *   B
		 */
	});
	displayText(`Number of running-sum depth increases: ${result2.length}`);
	updateCaption(`A graph of the seafloor is shown.`);
	updateCaption(`Above it are the number of depth increases (${result.length})`);
	updateCaption(`and the number of running-sum depth increases (${result2.length}).`);

	let startDepth = 0; // Where should the graph start?
	let lineInc = 10; // How many units should each line represent?

	let lowestDepth = 0;
	let positions = numbers.map(function(elem) {
		if((elem - startDepth) / lineInc > lowestDepth) {
			lowestDepth = (elem - startDepth) / lineInc;
		}
		return (elem - startDepth) / lineInc;
	});
	displayText("".padStart(numbers.length, "~"));
	// ¯―_
	// YMMV on whether these are the best characters for this.
	let currentDepth = startDepth;
	while(currentDepth < lowestDepth) {
		let toDisplay = "";
		let ignore = 0;
		positions.forEach(function(depth, index) {
			if(ignore !== 0) {
				ignore--;
			} else {
				if(Math.floor(depth) === currentDepth) {
					let fracPart = depth - Math.floor(depth);
					if(fracPart < 1 / 3) {
						toDisplay += "¯";
					} else if(fracPart < 2 / 3) {
						toDisplay += "―";
					} else {
						toDisplay += "_";
					}
					if(index % 100 === 0) {
						toDisplay += numbers[index].toString().padStart(4, "0");
						ignore += 4;
					}
				} else {
					toDisplay += " ";
				}
			}
		});
		displayText(toDisplay);
		currentDepth++;
	}
}