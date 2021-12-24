"use strict";

function day22(input) {
	/*input = ``;/**/
	const FILE_REGEX = /(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/gm;
	let reboot = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		reboot.push([entry[1], +entry[2], +entry[3], +entry[4], +entry[5], +entry[6], +entry[7]]);
	}

	function planeCheck(plane1, plane2) {
		let p1lY = plane1[0][0];
		let p1gY = plane1[1][0];
		let p1lZ = plane1[0][1];
		let p1gZ = plane1[1][1];
		let p2lY = plane2[0][0];
		let p2gY = plane2[1][0];
		let p2lZ = plane2[0][1];
		let p2gZ = plane2[1][1];
		let p1LBL = p1lZ < p2lZ; // "plane 1 left bound left" (of plane 2's left bound)
		let p1LBR = p1lZ > p2gZ; // "plane 1 left bound right" (of plane 2's right bound)
		let p1RBR = p1gZ > p2gZ; // "plane 1 right bound right" (of plane 2's right bound)
		let p1RBL = p1gZ < p2lZ; // "plane 1 right bound left" (of plane 2's left bound)
		let p1DBD = p1lY < p2lY; // "plane 1 down bound down" (of plane 2's down bound)
		let p1DBU = p1lY > p2gY; // "plane 1 down bound up" (of plane 2's up bound)
		let p1UBU = p1gY > p2gY; // "plane 1 up bound up" (of plane 2's up bound)
		let p1UBD = p1gY < p2lY; // "plane 1 up bound down" (of plane 2's down bound)
		let p2LBL = p2lZ < p1lZ; // "plane 2 left bound left" (of plane 1's left bound)
		let p2LBR = p2lZ > p1gZ; // "plane 2 left bound right" (of plane 1's right bound)
		let p2RBR = p2gZ > p1gZ; // "plane 2 right bound right" (of plane 1's right bound)
		let p2RBL = p2gZ < p1lZ; // "plane 2 right bound left" (of plane 1's left bound)
		let p2DBD = p2lY < p1lY; // "plane 2 down bound down" (of plane 1's down bound)
		let p2DBU = p2lY > p1gY; // "plane 2 down bound up" (of plane 1's up bound)
		let p2UBU = p2gY > p1gY; // "plane 2 up bound up" (of plane 1's up bound)
		let p2UBD = p2gY < p1lY; // "plane 2 up bound down" (of plane 1's down bound)
		let BL1in = !p1LBL && !p1LBR && !p1DBD && !p1DBU; // Bottom left corner of plane 1 in plane 2?
		let BR1in = !p1RBL && !p1RBR && !p1DBD && !p1DBU; // Bottom right corner of plane 1 in plane 2?
		let TL1in = !p1LBL && !p1LBR && !p1UBD && !p1UBU; // Top left corner of plane 1 in plane 2?
		let TR1in = !p1RBL && !p1RBR && !p1UBD && !p1UBU; // Top right corner of plane 1 in plane 2?
		let BL2in = !p2LBL && !p2LBR && !p2DBD && !p2DBU; // Bottom left corner of plane 2 in plane 1?
		let BR2in = !p2RBL && !p2RBR && !p2DBD && !p2DBU; // Bottom right corner of plane 2 in plane 1?
		let TL2in = !p2LBL && !p2LBR && !p2UBD && !p2UBU; // Top left corner of plane 2 in plane 1?
		let TR2in = !p2RBL && !p2RBR && !p2UBD && !p2UBU; // Top right corner of plane 2 in plane 1?
		//console.log(`BL: ${BL1in}, BR: ${BR1in}, TL: ${TL1in}, TR: ${TR1in}`);

		if(BL1in && TR1in) {
			// The first plane is entirely inside the second.
			//console.log(`Plane 1 in Plane 2`);
			return [[[p2lY, p2lZ], [p1lY - 1, p2gZ]],
					[[p1lY, p2lZ], [p2gY, p1lZ - 1]],
					[[p1gY + 1, p1lZ], [p2gY, p2gZ]],
					[[p1lY, p1gZ + 1], [p1gY, p2gZ]]].filter(e => e[1][0] >= e[0][0] && e[1][1] >= e[0][1]);
		}
		if(BL2in && TR2in) {
			// The second plane is entirely inside the first.
			//console.log(`Plane 2 in Plane 1`);
			return [];
		}
		if((BL1in && TL1in) || (BL1in && BR1in) || (TR1in && TL1in) || (TR1in && BR1in)) {
			// Two corners of the first plane are inside the second.
			if(BL1in && TL1in) {
				//console.log(`BL and TL in plane 2`);
				return [[[p2lY, p2lZ], [p1lY - 1, p2gZ]],
						[[p1lY, p2lZ], [p2gY, p1lZ - 1]],
						[[p1gY + 1, p1lZ], [p2gY, p2gZ]]].filter(e => e[1][0] >= e[0][0] && e[1][1] >= e[0][1]);
			} else if(BL1in && BR1in) {
				//console.log(`BL and BR in plane 2`);
				return [[[p2lY, p2lZ], [p2gY, p1lZ - 1]],
						[[p2lY, p1lZ], [p1lY - 1, p2gZ]],
						[[p1lY, p1gZ + 1], [p2gY, p2gZ]]].filter(e => e[1][0] >= e[0][0] && e[1][1] >= e[0][1]);
			} else if(TR1in && TL1in) {
				//console.log(`TR and TL in plane 2`);
				return [[[p2lY, p2lZ], [p2gY, p1lZ - 1]],
						[[p1gY + 1, p1lZ], [p2gY, p2gZ]],
						[[p2lY, p1gZ + 1], [p1gY, p2gZ]]].filter(e => e[1][0] >= e[0][0] && e[1][1] >= e[0][1]);
			} else {
				//console.log(`TR and BR in plane 2`);
				return [[[p2lY, p2lZ], [p1lY - 1, p2gZ]],
						[[p1lY, p1gZ + 1], [p2gY, p2gZ]],
						[[p1gY + 1, p2lZ], [p2gY, p1gZ]]].filter(e => e[1][0] >= e[0][0] && e[1][1] >= e[0][1]);
			}
		}
		if((BL2in && TL2in) || (BL2in && BR2in) || (TR2in && TL2in) || (TR2in && BR2in)) {
			// Two corners of the second plane are inside the first.
			if(BL2in && TL2in) {
				//console.log(`BL and TL in plane 1`);
				return [[[p2lY, p1gZ + 1], [p2gY, p2gZ]]];
			} else if(BL2in && BR2in) {
				//console.log(`BL and BR in plane 1`);
				return [[[p1gY + 1, p2lZ], [p2gY, p2gZ]]];
			} else if(TR2in && TL2in) {
				//console.log(`TR and TL in plane 1`);
				return [[[p2lY, p2lZ], [p1lY - 1, p2gZ]]];
			} else {
				//console.log(`TR and BR in plane 1`);
				return [[[p2lY, p2lZ], [p2gY, p1lZ - 1]]];
			}
		}
		if(BL1in || BR1in || TL1in || TR1in) {
			// One corner of the first plane is inside the second.
			if(BL1in) {
				//console.log(`BL in plane 2`);
				return [[[p2lY, p2lZ], [p2gY, p1lZ - 1]],
						[[p2lY, p1lZ], [p1lY - 1, p2gZ]]];
			} else if(BR1in) {
				//console.log(`BR in plane 2`);
				return [[[p2lY, p2lZ], [p1lY - 1, p2gZ]],
						[[p1lY, p1gZ + 1], [p2gY, p2gZ]]];
			} else if(TL1in) {
				//console.log(`TL in plane 2`);
				return [[[p2lY, p2lZ], [p2gY, p1lZ - 1]],
						[[p1gY + 1, p1lZ], [p2gY, p2gZ]]];
			} else if(TR1in) {
				//console.log(`TR in plane 2`);
				return [[[p1gY + 1, p2lZ], [p2gY, p2gZ]],
						[[p2lY, p1gZ + 1], [p1gY, p2gZ]]];
			} else {
				throw `Thought 1 corner was in, but I guess not.`
			}
		}

		if((!p1DBD && !p1UBU && p1RBR && p1LBL) || (p1DBD && p1UBU && !p1RBR && !p1LBL)) {
			// No corners of either plane are inside the other, but they overlap in the center.
			//    (ie a + shape.)
			if(!p1DBD && !p1UBU && p1RBR && p1LBL) {
				//console.log(`Plane 1 is the horizontal of the +`);
				// p1 is the horizontal part of the +
				return [[[p2lY, p2lZ], [p1lY - 1, p2gZ]],
						[[p1gY + 1, p2lZ], [p2gY, p2gZ]]];
			} else if(p1DBD && p1UBU && !p1RBR && !p1LBL) {
				//console.log(`Plane 1 is the vertical of the +`);
				// p1 is the vertical part of the +
				return [[[p2lY, p2lZ], [p2gY, p1lZ - 1]],
						[[p2lY, p1gZ + 1], [p2gY, p2gZ]]];
			} else {
				throw `Thought it was a plus, but I guess not.`;
			}
		}

		// The planes are separate.
		//console.log("Planes are separate");
		return "sep";
	}

	let cubes = new Map();
	let regions = new Map();
	let post50 = false;
	for(let i = 0; i < reboot.length; i++) {
		let step = reboot[i];
		if(!post50 && (Math.abs(step[1]) > 50 || Math.abs(step[3]) > 50 || Math.abs(step[5]) > 50)) {
			post50 = true;
			let post50On = 0;
			cubes.forEach(function(val, key) {
				if(typeof key === "number") {
					val.forEach(function(plane) {
						post50On += (plane[1][0] - plane[0][0] + 1) * (plane[1][1] - plane[0][1] + 1);
					});
				}
			});
			displayText(`Total on after initialization: ${post50On}`);
			updateCaption(`Total on after initialization: ${post50On}`);
		}
		console.log(`Processing step ${i + 1}: ${step}`);
		for(let x = Math.min(step[1], step[2]); x <= Math.max(step[1], step[2]); x++) {
			let minY = Math.min(step[3], step[4]);
			let maxY = Math.max(step[3], step[4]);
			let minZ = Math.min(step[5], step[6]);
			let maxZ = Math.max(step[5], step[6]);
			if(cubes.has(x)) {
				let planes = cubes.get(x);
				for(let j = 0; j < planes.length; j++) {
					// console.log(`Checking overlap with ${planes[j]}`);
					let newPlanes = planeCheck([[minY, minZ], [maxY, maxZ]], planes[j]);
					// console.log(`Result: ${newPlanes}`);
					if(newPlanes !== "sep") {
						planes.splice(j, 1, ...newPlanes);
						j = -1;
					}
				}
				if(step[0] === "on") planes.push([[minY, minZ], [maxY, maxZ]]);
				//console.log(JSON.parse(JSON.stringify(planes)));
				cubes.set(x, planes);
			} else {
				if(step[0] === "on") cubes.set(x, [[[minY, minZ], [maxY, maxZ]]]);
			}
			//for(let y = Math.min(step[3], step[4]); y <= Math.max(step[3], step[4]); y++) {
			//	for(let z = Math.min(step[5], step[6]); z <= Math.max(step[5], step[6]); z++) {
			//		cubes.set([x, y, z].join(), step[0] === "on");
			//	}
				/*if(cubes.has([x, y].join())) {
					let regionCheck = cubes.get([x, y].join());
					let overlapped = false;
					for(let j = 0; j < regionCheck.length; j++) {
						if(Math.max(step[5], step[6]) < regionCheck[j][0] || Math.min(step[5], step[6]) > regionCheck[j][1]) {
							// step is entirely outside of this region
						} else if(Math.max(step[5], step[6]) >= regionCheck[j][1] && Math.min(step[5], step[6]) <= regionCheck[j][0]) {
							overlapped = true;
							// this region is entirely within step.
							if(step[0]) {
								regionCheck[j][0] = Math.min(step[5], step[6]);
								regionCheck[j][1] = Math.max(step[5], step[6]);
							} else {
								regionCheck.splice(j, 1);
							}
							break;
						} else if(Math.max(step[5], step[6]) >= regionCheck[j][1]) {
							overlapped = true;
							// this region's upper bound is within step.
							if(step[0]) {
								regionCheck[j][1] = Math.max(step[5], step[6]);
							} else {
								regionCheck[j][1] = Math.min(step[5], step[6]);
							}
							break;
						} else if(Math.min(step[5], step[6]) <= regionCheck[j][0]) {
							overlapped = true;
							// this region's lower bound is within step.
							if(step[0]) {
								regionCheck[j][0] = Math.min(step[5], step[6]);
							} else {
								regionCheck[j][0] = Math.max(step[5], step[6]);
							}
							break;
						} else if(Math.min(step[5], step[6]) >= regionCheck[j][0] && Math.max(step[5], step[6]) <= regionCheck[j][1]) {
							overlapped = true;
							// step is entirely within this region
							if(step[0]) {
							} else {
								regionCheck.push([Math.max(step[5], step[6]), regionCheck[j][1]]);
								regionCheck[j][1] = Math.min(step[5], step[6]);
							}
							break;
						} else {
							throw `Unable to determine overlap for ${step} and ${regionCheck}`;
						}
					}
					if(!overlapped) {
						if(step[0] === "on") {
							regionCheck.push([Math.min(step[5], step[6]), Math.max(step[5], step[6])]);
						}
					}
					cubes.set([x, y].join(), regionCheck);
				} else if(step[0] === "on") {
					cubes.set([x, y].join(), [[Math.min(step[5], step[6]), Math.max(step[5], step[6])]]);
				}*/
			//}
		}
		/*let interOn = 0;
		let correctOn = 0;
		cubes.forEach(function(val, key) {
			if(typeof key !== "number") {
				correctOn += +val;
			} else {
				val.forEach(function(plane) {
					interOn += (plane[1][0] - plane[0][0] + 1) * (plane[1][1] - plane[0][1] + 1);
				});
			}
		});
		console.log(`Cubes on : ${interOn}`);
		console.log(`Should be: ${correctOn}`);*/
	}
	let totalOn = 0;
	cubes.forEach(function(val, key) {
		if(typeof key === "number") {
			val.forEach(function(plane) {
				totalOn += (plane[1][0] - plane[0][0] + 1) * (plane[1][1] - plane[0][1] + 1);
			});
		}
	});
	displayText(`Total on after reboot: ${totalOn}`);
	updateCaption(`Total on after reboot: ${totalOn}`);
}