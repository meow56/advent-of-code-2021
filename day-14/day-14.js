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

	const STEPS = 10;
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
		console.groupCollapsed(`Step ${i + 1}`);
		polyMap.forEach((v, k) => console.log(`${k}: ${v}`));
		console.groupEnd();
	}

	let elemMap = new Map();
	polyMap.forEach(function(num, pair) {
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

	let highestVal = 0;
	let lowestVal = 1000000000000000000000;
	elemMap.forEach(function(num) {
		if(num > highestVal) highestVal = num;
		if(num < lowestVal) lowestVal = num;
	});

	displayText(`Range: ${highestVal - lowestVal}`);
}