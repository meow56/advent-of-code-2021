"use strict";

function day6(input) {
	const FILE_REGEX = /./g;
	let ages = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		ages.push(entry[0].split(","));
	}
	ages = ages.filter(e => e.length === 1).map(e => +e);
	
	// Oh no, it turns out simulating 256 days is too intensive.
	// Can't believe simulating ~1e11 (2^(256/7)) fish is too much.
	let age_buckets = new Map();
	age_buckets.set(0, 0);
	age_buckets.set(1, 0);
	age_buckets.set(2, 0);
	age_buckets.set(3, 0);
	age_buckets.set(4, 0);
	age_buckets.set(5, 0);
	age_buckets.set(6, 0);
	for(let i = 0; i < ages.length; i++) {
		age_buckets.set(ages[i], age_buckets.get(ages[i]) + 1);
	}
	age_buckets.set(7, 0);
	age_buckets.set(8, 0);

	function getLength() {
		return age_buckets.get(0) +
			   age_buckets.get(1) +
			   age_buckets.get(2) +
			   age_buckets.get(3) +
			   age_buckets.get(4) +
			   age_buckets.get(5) +
			   age_buckets.get(6) +
			   age_buckets.get(7) +
			   age_buckets.get(8);
	}

	const DAYS = 256;
	for(let i = 1; i <= DAYS; i++) {
		age_buckets.forEach(function(bucket, age, map) {
			if(age !== -1) {
				map.set(age - 1, bucket);
			}
		});
		age_buckets.set(6, age_buckets.get(-1) + age_buckets.get(6));
		age_buckets.set(8, age_buckets.get(-1));
		if(i === 80) {
			displayText(`On day 80, there are ${getLength()} fish.`);
		}
		console.groupCollapsed(`Day ${i}: ${getLength()} fish`);
		console.log(`0 fish: ${age_buckets.get(0)}`);
		console.log(`1 fish: ${age_buckets.get(1)}`);
		console.log(`2 fish: ${age_buckets.get(2)}`);
		console.log(`3 fish: ${age_buckets.get(3)}`);
		console.log(`4 fish: ${age_buckets.get(4)}`);
		console.log(`5 fish: ${age_buckets.get(5)}`);
		console.log(`6 fish: ${age_buckets.get(6)}`);
		console.log(`7 fish: ${age_buckets.get(7)}`);
		console.log(`8 fish: ${age_buckets.get(8)}`);
		console.groupEnd();
	}
	displayText(`On day ${DAYS}, there are ${getLength()} fish.`);
}