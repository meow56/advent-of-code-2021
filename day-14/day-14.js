"use strict";

function day14(input) {
	/*input = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;*/
	const FILE_REGEX = /^([A-Z]+)$|(?:([A-Z]+) -> ([A-Z]))/gm;
	let polymer = [];
	let rules = new Map();
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		if(typeof entry[1] !== "undefined") {
			polymer = entry[1].split("");
		} else {
			rules.set(entry[2], entry[3]);
		}
	}

	let firstElem = polymer[0];
	let lastElem = polymer[polymer.length - 1];

	let polyMap = new Map();
	for(let i = 0; i + 1 < polymer.length; i++) {
		let polyKey = polymer[i] + polymer[i + 1];
		if(polyMap.has(polyKey)) {
			polyMap.set(polyKey, polyMap.get(polyKey) + 1);
		} else {
			polyMap.set(polyKey, 1);
		}
	}

	const STEPS = 40;
	let step10Polys;
	let leaderboards = [];
	for(let i = 0; i < STEPS; i++) {
		let workingPolyMap = new Map();
		polyMap.forEach(function(num, pair) {
			if(rules.has(pair)) {
				let firstKey = pair[0] + rules.get(pair);
				let secondKey = rules.get(pair) + pair[1];
				if(workingPolyMap.has(firstKey)) {
					workingPolyMap.set(firstKey, workingPolyMap.get(firstKey) + num);
				} else {
					workingPolyMap.set(firstKey, num);
				}
				if(workingPolyMap.has(secondKey)) {
					workingPolyMap.set(secondKey, workingPolyMap.get(secondKey) + num);
				} else {
					workingPolyMap.set(secondKey, num);
				}
			} else {
				if(workingPolyMap.has(pair)) {
					workingPolyMap.set(pair, workingPolyMap.get(pair) + num);
				} else {
					workingPolyMap.set(pair, num);
				}
			}
		});
		polyMap = workingPolyMap;
		if(i === 9) {
			step10Polys = workingPolyMap;
		}
		let interElemMap = getElems(polyMap);
		leaderboards.push(mapQuickSort(interElemMap));
	}

	function mapQuickSort(toSort) {
		// Sorts a map such that the [key, value] pair with the highest
		// value is inserted first. (assuming value is an int)
		// Hmm, this might actually be stable. Not sure though.
		if(toSort.size <= 1) return toSort;
		let mapKeys = toSort.keys();
		let pivot = mapKeys.next().value;
		let pivotVal = toSort.get(pivot);
		let lessThan = new Map();
		let greaterThan = new Map();
		let equalTo = new Map([[pivot, pivotVal]]);
		toSort.forEach(function(val, key) {
			if(val > pivotVal) {
				greaterThan.set(key, val);
			} else if(val < pivotVal) {
				lessThan.set(key, val);
			} else {
				equalTo.set(key, val);
			}
		});
		greaterThan = mapQuickSort(greaterThan);
		lessThan = mapQuickSort(lessThan);
		let finalMap = new Map();
		greaterThan.forEach(function(val, key) {
			finalMap.set(key, val);
		});
		equalTo.forEach(function(val, key) {
			finalMap.set(key, val);
		});
		lessThan.forEach(function(val, key) {
			finalMap.set(key, val);
		});
		return finalMap;
	}

	function getElems(map) {
		let elemMap = new Map();
		map.forEach(function(num, pair) {
			if(elemMap.has(pair[0])) {
				elemMap.set(pair[0], elemMap.get(pair[0]) + num);
			} else {
				elemMap.set(pair[0], num);
			}
			if(elemMap.has(pair[1])) {
				elemMap.set(pair[1], elemMap.get(pair[1]) + num);
			} else {
				elemMap.set(pair[1], num);
			}
		});

		elemMap.forEach((v, k) => elemMap.set(k, v / 2));
		// Each element is counted twice, except for the beginning and end elements.
		// But since those stay the same, it's not that hard to correct.
		elemMap.set(firstElem, Math.round(elemMap.get(firstElem) + (1/2)));
		elemMap.set(lastElem, Math.round(elemMap.get(lastElem) + (1/2)));
		return elemMap;
	}

	let elemMap = getElems(polyMap);

	let elem10Map = getElems(step10Polys);

	let highestVal = 0;
	let lowestVal = 1000000000000000000000;
	elemMap.forEach(function(num) {
		if(num > highestVal) highestVal = num;
		if(num < lowestVal) lowestVal = num;
	});

	let highest10Val = 0;
	let lowest10Val = 1000000000000000000000;
	elem10Map.forEach(function(num) {
		if(num > highest10Val) highest10Val = num;
		if(num < lowest10Val) lowest10Val = num;
	});

	displayText(`Step 10 range: ${highest10Val - lowest10Val}`);
	displayText(`Step 40 range: ${highestVal - lowestVal}`);

	const ANIM_INTERVAL = 2000;
	function animateLeaderboards(step, block) {
		if(step === leaderboards.length) return;
		block.clearText();
		block.displayText(`Step ${step + 1} Leaderboards:`);
		let placement = 1;
		leaderboards[step].forEach(function(num, elem) {
			let toDisplay = `${placement++})`.padStart(3, " ");
			switch(elem) {
				case "N":
					toDisplay += "Nitrogen";
					break;
				case "O":
					toDisplay += "Oxygen";
					break;
				case "K":
					toDisplay += "Potassium";
					break;
				case "C":
					toDisplay += "Carbon";
					break;
				case "H":
					toDisplay += "Hydrogen";
					break;
				case "P":
					toDisplay += "Phosphorus";
					break;
				case "F":
					toDisplay += "Flourine";
					break;
				case "S":
					toDisplay += "Sulfur";
					break;
				case "V":
					toDisplay += "Vanadium";
					// What kind of self-respecting polymer
					// DOESN'T have vanadium?
					// Though there do seem to be some results
					// for "polymers with vanadium".
					break;
				case "B":
					toDisplay += "Boron";
					break;
				default:
					throw `Missed element ${elem}`;
			}
			toDisplay += ":";
			toDisplay = toDisplay.padEnd(15, " ");
			toDisplay += num.toString().padStart(13, " ");
			block.displayText(toDisplay);
		});
		setTimeout(animateLeaderboards, ANIM_INTERVAL, step + 1, block);
	}
	animateLeaderboards(0, assignBlock("leaderboards"));
	updateCaption("A leaderboard is shown, showing the number of each element");
	updateCaption("at each step. The solutions to the problem are also shown:");
	updateCaption(`Step 10: ${highest10Val - lowest10Val}; Step 40: ${highestVal - lowestVal}`);
}