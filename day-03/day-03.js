"use strict";

function day3(input) {
	const FILE_REGEX = /\d+/g;
	let num = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		num.push(entry[0]);
	}

	let counts = [];
	num.forEach(function(elem) {
		for(let i = 0; i < elem.length; i++) {
			if(elem[i] === "1") {
				if(typeof counts[i] === "undefined") {
					counts[i] = 1;
				} else {
					counts[i]++;
				}
			}
		}
	});

	let gamma = "";
	let epsilon = "";
	for(let i = 0; i < counts.length; i++) {
		if(counts[i] > num.length / 2) {
			gamma += "1";
			epsilon += "0";
		} else {
			gamma += "0";
			epsilon += "1";
		}
	}

	displayText(`Power usage: ${parseInt(gamma, 2) * parseInt(epsilon, 2)}`)
}