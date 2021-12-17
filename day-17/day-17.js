"use strict";

function day17(input) {
	//input = ``;
	const FILE_REGEX = /target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/gm;
	let target;
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		target = [[+entry[1], +entry[2]], [+entry[3], +entry[4]]];
	}

	function tri(n) {
		return n * (n + 1) / 2;
	}

	let highX = Math.max(target[0][0], target[0][1]);
	let lowX = Math.min(target[0][0], target[0][1]);
	let highY = Math.max(target[1][0], target[1][1]);
	let lowY = Math.min(target[1][0], target[1][1]);
	let highestHitY = 0;
	for(let initXVel = 0; initXVel <= highX; initXVel++) {
		if(tri(initXVel) < lowX) {
			// there's no way we'll ever reach the target.
			continue;
		}
		for(let initYVel = lowY; initYVel < 1000000; initYVel++) {
			// For positive y, the max reached is tri(y).
			// Then, it will hit y = 0 after 2y + 1 steps.
			// n, n - 1, n - 2, n - 3, ..., 3, 2, 1 [n steps]
			// 0 [1 step]
			// -1, -2, -3, ... -(n - 3), -(n - 2), -(n - 1), -n [n steps]
			if(initYVel > 0) {
				let currentHighY = tri(initYVel);
				if(currentHighY < highestHitY) continue;
				let xVel = Math.max(0, initXVel - (2 * initYVel) - 1);
				let yVel = -1 * initYVel - 1;
				let xPos = tri(initXVel) - tri(xVel);
				let yPos = 0;
				let hitTarget = false;
				while(yPos >= lowY && xPos <= highX) {
					xPos += xVel;
					yPos += yVel;
					if(xVel > 0) {
						xVel--;
					}
					yVel--;
					if(xPos >= lowX && yPos <= highY && yPos >= lowY && xPos <= highX) {
						hitTarget = true;
						break;
					}
				}
				if(hitTarget && highestHitY < currentHighY) {
					highestHitY = currentHighY;
				}
			} else {
				/*let currentHighY = 0;
				if(currentHighY < highestHitY) continue;
				let xVel = initXVel;
				let yVel = initYVel;
				let xPos = 0;
				let yPos = 0;
				let hitTarget = false;
				while(yPos >= lowY && xPos <= highX) {
					xPos += xVel;
					yPos += yVel;
					if(xVel > 0) {
						xVel--;
					}
					yVel--;
					if(xPos >= lowX && yPos <= highY) {
						hitTarget = true;
						break;
					}
				}
				if(hitTarget && highestHitY < currentHighY) {
					highestHitY = currentHighY;
				}*/
			}
		}
	}

	displayText(`Highest flex: ${highestHitY}`);
}