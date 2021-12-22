"use strict";

function day22(input) {
	/*input = ``;/**/
	const FILE_REGEX = /(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/gm;
	let reboot = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		reboot.push([entry[1], +entry[2], +entry[3], +entry[4], +entry[5], +entry[6], +entry[7]]);
	}

	let cubes = new Map();
	for(let i = 0; i < reboot.length; i++) {
		let step = reboot[i];
		if(Math.abs(step[1]) > 50 || Math.abs(step[3]) > 50 || Math.abs(step[5]) > 50) {
			continue;
		}
		for(let x = Math.min(step[1], step[2]); x <= Math.max(step[1], step[2]); x++) {
			for(let y = Math.min(step[3], step[4]); y <= Math.max(step[3], step[4]); y++) {
				for(let z = Math.min(step[5], step[6]); z <= Math.max(step[5], step[6]); z++) {
					cubes.set([x, y, z].join(), step[0] === "on");
				}
			}
		}
	}
	let totalOn = 0;
	cubes.forEach(function(val) {
		totalOn += +val;
	});
	displayText(`Total on: ${totalOn}`);
}