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
}