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
}