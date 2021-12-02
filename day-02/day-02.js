"use strict";

function day2(input) {
	const FILE_REGEX = /((?:forward)|(?:down)|(?:up)) (\d)/g;
	let inst = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		inst.push([entry[1], +entry[2]]);
		// ["forward" or "down" or "up", int]
	}

	let dist = 0; // modified by forward
	let depth = 0; // modified by up and down

	inst.forEach(function(elem) {
		switch(elem[0]) {
			case "forward":
				dist += elem[1];
				break;
			case "down":
				depth += elem[1];
				break;
			case "up":
				depth -= elem[1];
				break;
		}
		if(depth < 0) throw "Flying submarine";
	});
	displayText(`Horizontal: ${dist}`);
	displayText(`Depth:      ${depth}`);
	displayText(`Mult:       ${dist * depth}`);
}