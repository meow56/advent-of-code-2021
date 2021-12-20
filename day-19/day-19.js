"use strict";

function day19(input) {
	/*input = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14
`;/**/
	const FILE_REGEX = /--- scanner (?:\d+) ---\n((?:-?\d+,-?\d+,-?\d+\n)+)/gm;
	let scanners = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		scanners.push(entry[1].trimEnd().split("\n").map(e => e.split(",").map(l => +l)));
		// Oof.
		// Pushes [[x, y, z], ...] where x, y, and z are ints.
	}
	console.log(scanners);
	console.log(JSON.parse(JSON.stringify(scanners)));

	{
		// There's a beacon at (1, 2, 3)
		// and a scanner at (0, 0, 0).
		// What does it report?
		// Facing +Z, +Y up: ( 1,  2,  3)
		// Facing +Z, +X up: (-2,  1,  3)
		// Facing +Z, -Y up: (-1, -2,  3)
		// Facing +Z, -X up: ( 2, -1,  3)

		// Facing -Z, +Y up: (-1,  2, -3)
		// Facing -Z, +X up: ( 2,  1, -3)
		// Facing -Z, -Y up: ( 1, -2, -3)
		// Facing -Z, -X up: (-2, -1, -3)

		// Facing +Y, +Z up: (-1,  3,  2)
		// Facing +Y, +X up: ( 3,  1,  2)
		// Facing +Y, -Z up: ( 1, -3,  2)
		// Facing +Y, -X up: (-3, -1,  2)

		// Facing -Y, +Z up: ( 1,  3, -2)
		// Facing -Y, +X up: (-3,  1, -2)
		// Facing -Y, -Z up: (-1, -3, -2)
		// Facing -Y, -X up: ( 3, -1, -2)

		// Facing -X, +Y up: ( 3,  2, -1)
		// Facing -X, +Z up: (-2,  3, -1)
		// Facing -X, -Y up: (-3, -2, -1)
		// Facing -X, -Z up: ( 2, -3, -1)

		// Facing +X, +Y up: (-3,  2,  1)
		// Facing +X, +Z up: ( 2,  3,  1)
		// Facing +X, -Y up: ( 3, -2,  1)
		// Facing +X, -Z up: (-2, -3,  1)





		// Facing +Z, +Y up: ( 1,  2,  3)
		// Facing +Z, -Y up: (-1, -2,  3)
		// Facing -Z, +Y up: (-1,  2, -3)
		// Facing -Z, -Y up: ( 1, -2, -3)

		// Facing +Z, +X up: (-2,  1,  3)
		// Facing +Z, -X up: ( 2, -1,  3)
		// Facing -Z, +X up: ( 2,  1, -3)
		// Facing -Z, -X up: (-2, -1, -3)

		// Facing +Y, +Z up: (-1,  3,  2)
		// Facing +Y, -Z up: ( 1, -3,  2)
		// Facing -Y, +Z up: ( 1,  3, -2)
		// Facing -Y, -Z up: (-1, -3, -2)

		// Facing +Y, +X up: ( 3,  1,  2)
		// Facing +Y, -X up: (-3, -1,  2)
		// Facing -Y, +X up: (-3,  1, -2)
		// Facing -Y, -X up: ( 3, -1, -2)

		// Facing -X, +Y up: ( 3,  2, -1)
		// Facing -X, -Y up: (-3, -2, -1)
		// Facing +X, +Y up: (-3,  2,  1)
		// Facing +X, -Y up: ( 3, -2,  1)

		// Facing -X, +Z up: (-2,  3, -1)
		// Facing -X, -Z up: ( 2, -3, -1)
		// Facing +X, +Z up: ( 2,  3,  1)
		// Facing +X, -Z up: (-2, -3,  1)
	}

	let actualBeacons = [];
	let scanOffsets = [[0, 0, 0]];
	actualBeacons.push(scanners.shift());
	// Assume the first scanner is oriented correctly...

	const REARRS = ["XYZ", "xyZ", "xYz", "Xyz", // Face Z, Y up
					"xZY", "XzY", "XZy", "xzy", // Face Y, Z up
					"yXZ", "YxZ", "YXz", "yxz", // Face Z, X up
					"yZx", "Yzx", "YZX", "yzX", // Face X, Z up
					"ZXY", "zxY", "zXy", "Zxy", // Face Y, X up
					"ZYx", "zyx", "zYX", "ZyX"];// Face X, Y up
					// Caps: +, lower: -;
	let scanI = 0;
	while(scanners.length !== 0) {
		let currScan = scanners[scanI].slice();
		let orienFound = false;
		for(let i = 0; i < REARRS.length; i++) {
			let thisRe = REARRS[i];
			let thisSigns = "";
			thisSigns += thisRe[0].toUpperCase() === thisRe[0] ? "+" : "-";
			thisSigns += thisRe[1].toUpperCase() === thisRe[1] ? "+" : "-";
			thisSigns += thisRe[2].toUpperCase() === thisRe[2] ? "+" : "-";
			thisRe = thisRe.toUpperCase();
			let trueRe = "";
			trueRe += ((thisRe[0] === "X") ? "0" : ((thisRe[0] === "Y") ? "1" : "2"));
			trueRe += ((thisRe[1] === "X") ? "0" : ((thisRe[1] === "Y") ? "1" : "2"));
			trueRe += ((thisRe[2] === "X") ? "0" : ((thisRe[2] === "Y") ? "1" : "2"));
			let reScan = currScan.map(function(coor, index) {
				return [coor[trueRe[0]] * parseInt(thisSigns[0] + "1", 10),
						coor[trueRe[1]] * parseInt(thisSigns[1] + "1", 10),
						coor[trueRe[2]] * parseInt(thisSigns[2] + "1", 10)];
			});

			for(let i = 0; i < actualBeacons.length; i++) {
				let allOffsets = new Map();
				for(let j = 0; j < actualBeacons[i].length; j++) {
					for(let k = 0; k < reScan.length; k++) {
						let offset = [actualBeacons[i][j][0] - reScan[k][0],
									  actualBeacons[i][j][1] - reScan[k][1],
									  actualBeacons[i][j][2] - reScan[k][2]];
						if(allOffsets.has(offset.join(","))) {
							allOffsets.set(offset.join(","), allOffsets.get(offset.join(",")) + 1);
						} else {
							allOffsets.set(offset.join(","), 1);
						}
					}
				}
				allOffsets.forEach(function(val, key) {
					if(orienFound) return;
					if(val >= 12) {
						console.log(`orient found`);
						let offset = key.split(",").map(e => +e);
						scanOffsets.push(offset);
						actualBeacons.push(reScan.map(function(coords) {
							return [coords[0] + offset[0], 
									coords[1] + offset[1],
									coords[2] + offset[2]];
						}));
						orienFound = true;
					}
				});
			}
			if(orienFound) break;
		}
		if(orienFound) {
			scanners.splice(scanI, 1);
			scanI %= scanners.length;
		} else {
			scanI++;
			scanI %= scanners.length;
		}
	}

	let seenBefore = [];
	actualBeacons = actualBeacons.flat().filter(function(beacon) {
		if(seenBefore.some(function(coor) {
			return coor[0] === beacon[0] && coor[1] === beacon[1] && coor[2] === beacon[2];
		})) {
			return false;
		} else {
			seenBefore.push(beacon);
			return true;
		}
	});

	let largestDist = 0;
	for(let i = 0; i < scanOffsets.length; i++) {
		for(let j = i; j < scanOffsets.length; j++) {
			let dist = Math.abs(scanOffsets[i][0] - scanOffsets[j][0]) +
					   Math.abs(scanOffsets[i][1] - scanOffsets[j][1]) +
					   Math.abs(scanOffsets[i][2] - scanOffsets[j][2]);
			if(dist > largestDist) {
				largestDist = dist;
			}
		}
	}
	displayText(`Number of beacons: ${actualBeacons.length}`);
	displayText(`Largest distance: ${largestDist}`);
	updateCaption(`Number of beacons: ${actualBeacons.length}`);
	updateCaption(`Largest distance: ${largestDist}`);
}