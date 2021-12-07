"use strict";

function day7(input) {
	//input = "16,1,2,0,4,2,7,1,2,14";
	const FILE_REGEX = /\d+(?:,|$)/gm;
	let crabs = [];
	let entry;
	let lowest = 100000;
	let highest = 0;
	while(entry = FILE_REGEX.exec(input)) {
		let trueEntry = entry[0][entry[0].length - 1] === "," ? entry[0].substring(0, entry[0].length - 1) : entry[0];
		crabs.push(+trueEntry);
		if(+trueEntry < lowest) lowest = +trueEntry;
		if(+trueEntry > highest) highest = +trueEntry;
	}
	//console.log(crabs);
	//console.log(`Lowest: ${lowest}, Highest: ${highest}`);

	let fuelCosts = [];
	for(let i = lowest; i < highest; i++) {
		//console.groupCollapsed(`Testing position ${i}`);
		fuelCosts[i - lowest] = crabs.reduce(function(total, crab) {
			//console.log(`Moving crab ${crab} to ${i} costs ${Math.abs(i - crab)}`);
			return total + Math.abs(i - crab);
		}, 0);
		//console.log(`Moving to ${i} costs ${fuelCosts[i - lowest]}.`);
		//console.groupEnd();
	}
	let lowIndex;
	let lowestCost = fuelCosts.reduce(function(lowCost, cost, ind) {
		if(cost < lowCost) {
			lowIndex = ind;
			return cost;
		} else {
			return lowCost;
		}
	}, 1000000000000000);
	displayText(`Please align at ${lowIndex}, cost: ${lowestCost}`);
}