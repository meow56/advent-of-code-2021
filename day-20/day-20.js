"use strict";

function day20(input) {
	/*input = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`;/**/
	// too high: 5783, 5712
	const FILE_REGEX = /^(?:\.|#)+$/gm;
	let image = [];
	let lookupTable = FILE_REGEX.exec(input)[0].split("");
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		image.push(entry[0].split(""));
	}
	console.log(lookupTable);

	displayText(`Step 0:`);
	for(let j = 0; j < image.length; j++) {
		displayText(image[j].join(""));
	}

	const STEPS = 50;
	for(let i = 0; i < STEPS; i++) {
		let fill = (i % 2) ? "#" : ".";
		let finalImage = [];
		image.splice(0, 0, Array(image[0].length).fill(fill));
		image.push(Array(image[0].length).fill(fill));
		image.map(row => row.splice(0, 0, fill));
		image.map(row => row.push(fill));
		for(let j = 0; j < image.length; j++) {
			finalImage.push([]);
		}
		image.forEach(function(row, rI) {
			row.forEach(function(pixel, pI) {
				if(rI === 0) {
					let key = (fill === "#" ? "111" : "000");
					key += +((row[pI - 1] || fill) === "#");
					key += +((row[pI    ]) === "#");
					key += +((row[pI + 1] || fill) === "#");
					key += +((image[rI + 1][pI - 1] || fill) === "#");
					key += +((image[rI + 1][pI    ] || fill) === "#");
					key += +((image[rI + 1][pI + 1] || fill) === "#");
					finalImage[rI][pI] = lookupTable[parseInt(key, 2)];
				} else if(rI === image.length - 1) {
					let key = "";
					key += +((image[rI - 1][pI - 1] || fill) === "#");
					key += +((image[rI - 1][pI    ] || fill) === "#");
					key += +((image[rI - 1][pI + 1] || fill) === "#");
					key += +((row[pI - 1] || fill) === "#");
					key += +((row[pI    ]) === "#");
					key += +((row[pI + 1] || fill) === "#");
					key += (fill === "#" ? "111" : "000");
					finalImage[rI][pI] = lookupTable[parseInt(key, 2)];
				} else {
					let key = "";
					key += +((image[rI - 1][pI - 1] || fill) === "#");
					key += +((image[rI - 1][pI    ] || fill) === "#");
					key += +((image[rI - 1][pI + 1] || fill) === "#");
					key += +((row[pI - 1] || fill) === "#");
					key += +((row[pI    ]) === "#");
					key += +((row[pI + 1] || fill) === "#");
					key += +((image[rI + 1][pI - 1] || fill) === "#");
					key += +((image[rI + 1][pI    ] || fill) === "#");
					key += +((image[rI + 1][pI + 1] || fill) === "#");
					finalImage[rI][pI] = lookupTable[parseInt(key, 2)];
				}
			});
		});

		image = finalImage;
		displayText(`Step ${i + 1}:`);
		for(let j = 0; j < image.length; j++) {
			displayText(image[j].join(""));
		}
		if(i + 1 === 2) {
			let totalHash = image.flat().reduce(((acc, e) => acc + +(e === "#")), 0);
			displayText(`Total lit: ${totalHash}`);
			updateCaption(`Part 1's answer: ${totalHash}`);
		}
	}
	let totalHash = image.flat().reduce(((acc, e) => acc + +(e === "#")), 0);
	displayText(`Total lit: ${totalHash}`);
	updateCaption(`In addition to part 1's answer, a number of images are displayed.`);
	updateCaption(`Each one shows the previous image's enhancement.`);
	updateCaption(`Finally, part 2's answer is shown as well: ${totalHash}`);
}