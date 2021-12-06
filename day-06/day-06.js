"use strict";

function day6(input) {
	const FILE_REGEX = /./g;
	let ages = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		ages.push(entry[0].split(","));
	}
	ages = ages.filter(e => e.length === 1).map(e => +e);
	
	const DAYS = 80;
	for(let i = 1; i <= DAYS; i++) {
		let toAdd = [];
		ages = ages.map(function(fish) {
			if(--fish === -1) {
				fish = 6;
				toAdd.push(8);
			}
			return fish;
		});
		ages = ages.concat(toAdd);
		//console.log(`Day ${i}, ${ages.length} fish: ${ages}`);
	}
	displayText(`On day ${DAYS}, there are ${ages.length} fish.`);
}