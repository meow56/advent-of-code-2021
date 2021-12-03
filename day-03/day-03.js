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

	displayText(`Gamma rate: ${parseInt(gamma, 2)}`);
	displayText(`Epsilon rate: ${parseInt(epsilon, 2)}`);
	displayText(`Power usage: ${parseInt(gamma, 2) * parseInt(epsilon, 2)}`);

	function detRating(what, nums, index = 0) {
		// what: true = o2, false = co2
		if(nums.length === 1) {
			return nums[0];
		}
		if(nums.length === 0) {
			throw `No rating`;
		}
		let count = 0;
		nums.forEach(function(elem) {
			// Get the number of 1s.
			if(elem[index] === "1") {
				count++;
			}
		});
		if(what && count >= nums.length / 2) {
			// 1 is more common or equally common,
			// and we're doing oxygen.
			return detRating(what, nums.filter(elem => elem[index] === "1"), index + 1);
		} else if(what) {
			// 0 is more common,
			// and we're doing oxygen.
			return detRating(what, nums.filter(elem => elem[index] === "0"), index + 1);
		} else if(count < nums.length / 2) {
			// 1 is more common,
			// and we're doing carbon dioxide.
			return detRating(what, nums.filter(elem => elem[index] === "1"), index + 1);
		} else {
			// 0 is more common or equally common,
			// and we're doing carbon dioxide.
			return detRating(what, nums.filter(elem => elem[index] === "0"), index + 1);
		}
	}

	let oxyRat = detRating(true, num);
	let coRat = detRating(false, num);
	displayText(`O2 Rating: ${parseInt(oxyRat, 2)}`);
	displayText(`CO2 Rating: ${parseInt(coRat, 2)}`);
	displayText(`Life Rating: ${parseInt(oxyRat, 2) * parseInt(coRat, 2)}`);
}