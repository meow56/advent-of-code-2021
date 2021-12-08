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

	/* Done: ACDEF
	 *  AAAA 
	 * B    C
	 * B    C
	 *  DDDD
	 * E    F
	 * E    F
	 *  GGGG
	 * 0: ABCEFG
	 * 1: CF
	 * 2: ACDEG
	 * 3: ACDFG
	 * 4: BDCF
	 * 5: ABDFG
	 * 6: ABDEFG
	 * 7: ACF
	 * 8: ABCDEFG
	 * 9: ABCDFG
	 * So therefore: what appears in 7 and not in 1 must be A.
	 * The three of length 6 each are missing one. One of those is C, another E, and the final D.
	 * More precisely, the one that appears in 1 but not in one of the 6n must be C,
	 * and the other that appears in 1 must be F. Then the 6n would be 6.
	 * Now, of the two other 6ns, 4 includes D but not E. So the one that appears in 4
	 * must be D and the other is E.
	 */
	let total = 0;
	for(let i = 0; i < digits.length; i++) {
		let one = digits[i].filter(e => e.length === 2)[0];
		let four = digits[i].filter(e => e.length === 4)[0];
		let seven = digits[i].filter(e => e.length === 3)[0];
		let eight = digits[i].filter(e => e.length === 7)[0];

		let A;
		if(one.includes(seven[0])) {
			if(one.includes(seven[1])) {
				A = seven[2];
			} else {
				A = seven[1];
			}
		} else {
			A = seven[0];
		}

		let nice = digits[i].filter(e => e.length === 6); // 0, 6 and 9
		let missing1 = nice[0].split("").reduce(function(acc, value) {
			return acc.replace(value, "");
		}, "abcdefg");
		let missing2 = nice[1].split("").reduce(function(acc, value) {
			return acc.replace(value, "");
		}, "abcdefg");
		let missing3 = nice[2].split("").reduce(function(acc, value) {
			return acc.replace(value, "");
		}, "abcdefg");
		let C;
		let D;
		let E;
		let zero;
		let six;
		let nine;
		if(one.includes(missing1)) {
			C = missing1;
			six = nice[0];
		} else if(one.includes(missing2)) {
			C = missing2;
			six = nice[1];
		} else {
			C = missing3;
			six = nice[2];
		}

		if(!one.includes(missing1) && four.includes(missing1)) {
			D = missing1;
			zero = nice[0];
			E = C === missing2 ? missing3 : missing2;
			nine = six === nice[1] ? nice[2] : nice[1];
		} else if(!one.includes(missing2) && four.includes(missing2)) {
			D = missing2;
			zero = nice[1];
			E = C === missing3 ? missing1 : missing3;
			nine = six === nice[2] ? nice[0] : nice[2];
		} else {
			D = missing3;
			zero = nice[2];
			E = C === missing1 ? missing2 : missing1;
			nine = six === nice[0] ? nice[1] : nice[0];
		}

		// 2: ACDEG (no B, F)
		// 3: ACDFG (no B, E)
		// 5: ABDFG (no C, E)
		let finalFive = digits[i].filter(e => e.length === 5);
		let missing4 = finalFive[0].split("").reduce(function(acc, value) {
			return acc.replace(value, "");
		}, "abcdefg");
		let missing5 = finalFive[1].split("").reduce(function(acc, value) {
			return acc.replace(value, "");
		}, "abcdefg");
		let missing6 = finalFive[2].split("").reduce(function(acc, value) {
			return acc.replace(value, "");
		}, "abcdefg");
		let two;
		let three;
		let five;
		if(missing4.includes(C) && missing4.includes(E)) {
			five = finalFive[0];
		} else if(missing5.includes(C) && missing5.includes(E)) {
			five = finalFive[1];
		} else {
			five = finalFive[2];
		}

		if(missing4.includes(C) && !missing4.includes(E)) {
			three = finalFive[0];
		} else if(missing5.includes(C) && !missing5.includes(E)) {
			three = finalFive[1];
		} else {
			three = finalFive[2];
		}

		if(!missing4.includes(C) && !missing4.includes(E)) {
			two = finalFive[0];
		} else if(!missing5.includes(C) && !missing5.includes(E)) {
			two = finalFive[1];
		} else {
			two = finalFive[2];
		}
		
		displayText(`I think ${A} is A, ${C} is C, ${D} is D, and ${E} is E.`);
		let finalNum = outputs[i].reduce(function(acc, val) {
			if(val.length === 2) {
				return acc + "1";
			} else if(val.length === 4) {
				return acc + "4";
			} else if(val.length === 3) {
				return acc + "7";
			} else if(val.length === 7) {
				return acc + "8";
			} else if(val.length === 6) {
				let missing = val.split("").reduce(function(accu, value) {
					return accu.replace(value, "");
				}, "abcdefg");
				if(missing === D) {
					return acc + "0";
				} else if(missing === C) {
					return acc + "6";
				} else if(missing === E) {
					return acc + "9";
				} else {
					throw `Val ${val} is length 6, but is not missing D, C, or E (${D}, ${C}, ${E}).`;
				}
			} else if(val.length === 5) {
				let missing = val.split("").reduce(function(accu, value) {
					return accu.replace(value, "");
				}, "abcdefg");
				if(missing.includes(C) && missing.includes(E)) {
					return acc + "5";
				} else if(!missing.includes(C) && missing.includes(E)) {
					return acc + "3";
				} else if(!missing.includes(C) && !missing.includes(E)) {
					return acc + "2";
				} else {
					throw `Val ${val} is missing C (${C}) but not E (${E}).`;
				}
			} else {
				throw `Val ${val} is of length ${val.length}.`;
			}
		}, "");
		displayText(`Sorry, did you mean: ${finalNum}?`);
		total += +finalNum;
	}
	displayText(`That means that in total, we have ${total}.`);
}