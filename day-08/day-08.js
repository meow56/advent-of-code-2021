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

	const SEV_SEG = [
		new Set("abcefg".split("")),
		new Set("cf".split("")),
		new Set("acdeg".split("")),
		new Set("acdfg".split("")),
		new Set("bdcf".split("")),
		new Set("abdfg".split("")),
		new Set("abdefg".split("")),
		new Set("acf".split("")),
		new Set("abcdefg".split("")),
		new Set("abcdfg".split(""))
	]
	function sevenSeg(num) {
		// num is a string, don't be fooled.
		let firstRow = ".";
		let row23 = ".";
		let row4 = ".";
		let row56 = ".";
		let row7 = ".";
		let lookingAt = +num[0];
		const HOR_ON = ".####..";
		const OFF = ".......";
		const VER12 = "#....#.";
		const VER1 = "#......";
		const VER2 = ".....#.";
		if(SEV_SEG[lookingAt].has("a")) {
			firstRow += HOR_ON;
		} else {
			firstRow += OFF;
		}
		if(SEV_SEG[lookingAt].has("b") && SEV_SEG[lookingAt].has("c")) {
			row23 += VER12;
		} else if(SEV_SEG[lookingAt].has("b") && !SEV_SEG[lookingAt].has("c")) {
			row23 += VER1;
		} else if(!SEV_SEG[lookingAt].has("b") && SEV_SEG[lookingAt].has("c")) {
			row23 += VER2;
		} else {
			row23 += OFF;
		}
		if(SEV_SEG[lookingAt].has("d")) {
			row4 += HOR_ON;
		} else {
			row4 += OFF;
		}
		if(SEV_SEG[lookingAt].has("e") && SEV_SEG[lookingAt].has("f")) {
			row56 += VER12;
		} else if(SEV_SEG[lookingAt].has("e") && !SEV_SEG[lookingAt].has("f")) {
			row56 += VER1;
		} else if(!SEV_SEG[lookingAt].has("e") && SEV_SEG[lookingAt].has("f")) {
			row56 += VER2;
		} else {
			row56 += OFF;
		}
		if(SEV_SEG[lookingAt].has("g")) {
			row7 += HOR_ON;
		} else {
			row7 += OFF;
		}
		lookingAt = +num[1];
		if(SEV_SEG[lookingAt].has("a")) {
			firstRow += HOR_ON;
		} else {
			firstRow += OFF;
		}
		if(SEV_SEG[lookingAt].has("b") && SEV_SEG[lookingAt].has("c")) {
			row23 += VER12;
		} else if(SEV_SEG[lookingAt].has("b") && !SEV_SEG[lookingAt].has("c")) {
			row23 += VER1;
		} else if(!SEV_SEG[lookingAt].has("b") && SEV_SEG[lookingAt].has("c")) {
			row23 += VER2;
		} else {
			row23 += OFF;
		}
		if(SEV_SEG[lookingAt].has("d")) {
			row4 += HOR_ON;
		} else {
			row4 += OFF;
		}
		if(SEV_SEG[lookingAt].has("e") && SEV_SEG[lookingAt].has("f")) {
			row56 += VER12;
		} else if(SEV_SEG[lookingAt].has("e") && !SEV_SEG[lookingAt].has("f")) {
			row56 += VER1;
		} else if(!SEV_SEG[lookingAt].has("e") && SEV_SEG[lookingAt].has("f")) {
			row56 += VER2;
		} else {
			row56 += OFF;
		}
		if(SEV_SEG[lookingAt].has("g")) {
			row7 += HOR_ON;
		} else {
			row7 += OFF;
		}
		lookingAt = +num[2];
		if(SEV_SEG[lookingAt].has("a")) {
			firstRow += HOR_ON;
		} else {
			firstRow += OFF;
		}
		if(SEV_SEG[lookingAt].has("b") && SEV_SEG[lookingAt].has("c")) {
			row23 += VER12;
		} else if(SEV_SEG[lookingAt].has("b") && !SEV_SEG[lookingAt].has("c")) {
			row23 += VER1;
		} else if(!SEV_SEG[lookingAt].has("b") && SEV_SEG[lookingAt].has("c")) {
			row23 += VER2;
		} else {
			row23 += OFF;
		}
		if(SEV_SEG[lookingAt].has("d")) {
			row4 += HOR_ON;
		} else {
			row4 += OFF;
		}
		if(SEV_SEG[lookingAt].has("e") && SEV_SEG[lookingAt].has("f")) {
			row56 += VER12;
		} else if(SEV_SEG[lookingAt].has("e") && !SEV_SEG[lookingAt].has("f")) {
			row56 += VER1;
		} else if(!SEV_SEG[lookingAt].has("e") && SEV_SEG[lookingAt].has("f")) {
			row56 += VER2;
		} else {
			row56 += OFF;
		}
		if(SEV_SEG[lookingAt].has("g")) {
			row7 += HOR_ON;
		} else {
			row7 += OFF;
		}
		lookingAt = +num[3];
		if(SEV_SEG[lookingAt].has("a")) {
			firstRow += HOR_ON;
		} else {
			firstRow += OFF;
		}
		if(SEV_SEG[lookingAt].has("b") && SEV_SEG[lookingAt].has("c")) {
			row23 += VER12;
		} else if(SEV_SEG[lookingAt].has("b") && !SEV_SEG[lookingAt].has("c")) {
			row23 += VER1;
		} else if(!SEV_SEG[lookingAt].has("b") && SEV_SEG[lookingAt].has("c")) {
			row23 += VER2;
		} else {
			row23 += OFF;
		}
		if(SEV_SEG[lookingAt].has("d")) {
			row4 += HOR_ON;
		} else {
			row4 += OFF;
		}
		if(SEV_SEG[lookingAt].has("e") && SEV_SEG[lookingAt].has("f")) {
			row56 += VER12;
		} else if(SEV_SEG[lookingAt].has("e") && !SEV_SEG[lookingAt].has("f")) {
			row56 += VER1;
		} else if(!SEV_SEG[lookingAt].has("e") && SEV_SEG[lookingAt].has("f")) {
			row56 += VER2;
		} else {
			row56 += OFF;
		}
		if(SEV_SEG[lookingAt].has("g")) {
			row7 += HOR_ON;
		} else {
			row7 += OFF;
		}
		displayText(firstRow);
		displayText(row23);
		displayText(row23);
		displayText(row4);
		displayText(row56);
		displayText(row56);
		displayText(row7);
		displayText();
	}

	let total = 0;
	for(let i = 0; i < digits.length; i++) {
		let one = new Set(digits[i].filter(e => e.length === 2)[0].split(""));
		let four = new Set(digits[i].filter(e => e.length === 4)[0].split(""));
		let seven = new Set(digits[i].filter(e => e.length === 3)[0].split(""));
		let eight = new Set(digits[i].filter(e => e.length === 7)[0].split(""));

		let A, C, D, E;
		seven.forEach(function(segment) {
			if(!one.has(segment)) {
				A = segment;
			}
		});

		let n6_1 = new Set(digits[i].filter(e => e.length === 6)[0].split(""));
		let n6_2 = new Set(digits[i].filter(e => e.length === 6)[1].split(""));
		let n6_3 = new Set(digits[i].filter(e => e.length === 6)[2].split(""));
		one.forEach(function(segment) {
			if(!n6_1.has(segment) || !n6_2.has(segment) || !n6_3.has(segment)) {
				C = segment;
			}
		});
		four.forEach(function(segment) {
			if(segment !== C) {
				if(!n6_1.has(segment) || !n6_2.has(segment) || !n6_3.has(segment)) {
					D = segment;
				}
			}
		});
		if(n6_1.has(C) && n6_1.has(D)) {
			for(let i = 0; i < "abcdefg".length; i++) {
				if(!n6_1.has("abcdefg"[i])) {
					E = "abcdefg"[i];
				}
			}
		} else if(n6_2.has(C) && n6_2.has(D)) {
			for(let i = 0; i < "abcdefg".length; i++) {
				if(!n6_2.has("abcdefg"[i])) {
					E = "abcdefg"[i];
				}
			}
		} else if(n6_3.has(C) && n6_3.has(D)) {
			for(let i = 0; i < "abcdefg".length; i++) {
				if(!n6_3.has("abcdefg"[i])) {
					E = "abcdefg"[i];
				}
			}
		} else {
			throw `Wait, where's 9?`;
		}

		let finalOut = outputs[i].reduce(function(display, digit) {
			if(digit.length === 2) {
				return display + "1";
			} else if(digit.length === 4) {
				return display + "4";
			} else if(digit.length === 3) {
				return display + "7";
			} else if(digit.length === 7) {
				return display + "8";
			} else if(digit.length === 5) {
				let digSet = new Set(digit.split(""));
				if(digSet.has(C) && digSet.has(E)) {
					return display + "2";
				} else if(digSet.has(C) && !digSet.has(E)) {
					return display + "3";
				} else if(!digSet.has(C) && !digSet.has(E)) {
					return display + "5";
				} else {
					throw `Digit ${digit} has ${E} but not ${C}`;
				}
			} else if(digit.length === 6) {
				let digSet = new Set(digit.split(""));
				if(!digSet.has(D)) {
					return display + "0";
				} else if(!digSet.has(C)) {
					return display + "6";
				} else if(!digSet.has(E)) {
					return display + "9";
				} else {
					throw `Digit ${digit} is missing weird stuff.`;
				}
			} else {
				throw `Invalid length for digit ${digit}`;
			}
		}, "");
		sevenSeg(finalOut);
		total += +finalOut;
	}
	displayText(`Thus, the total is ${total}.`);
}