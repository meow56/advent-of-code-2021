"use strict";

function day11(input) {
	/*input = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;*/
	const FILE_REGEX = /(\d+)$/gm;
	let octopi = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		octopi.push(entry[1].split("").map(e => new Octopus(+e)));
	}

	function Octopus(energy) {
		this.energy = energy;
		this.hasFlashed = false;
		this.neighbors = [];
		this.cooldown = 0;

		this.increase = function() {
			this.energy++;
			if(!this.hasFlashed && this.energy > 9) {
				this.hasFlashed = true;
				this.cooldown = 1;
				this.neighbors.forEach(function(neighbor) {
					neighbor.increase();
				});
			}
		}
	}

	octopi.forEach(function(row, rI) {
		row.forEach(function(octopus, oI) {
			if(rI === 0) {
				if(oI === 0) {
					octopus.neighbors.push(row[oI + 1]);
					octopus.neighbors.push(octopi[rI + 1][oI + 1]);
					octopus.neighbors.push(octopi[rI + 1][oI]);
				} else if(oI === row.length - 1) {
					octopus.neighbors.push(octopi[rI + 1][oI]);
					octopus.neighbors.push(octopi[rI + 1][oI - 1]);
					octopus.neighbors.push(row[oI - 1]);
				} else {
					octopus.neighbors.push(row[oI + 1]);
					octopus.neighbors.push(octopi[rI + 1][oI + 1]);
					octopus.neighbors.push(octopi[rI + 1][oI]);
					octopus.neighbors.push(octopi[rI + 1][oI - 1]);
					octopus.neighbors.push(row[oI - 1]);
				}
			} else if(rI === octopi.length - 1) {
				if(oI === 0) {
					octopus.neighbors.push(row[oI + 1]);
					octopus.neighbors.push(octopi[rI - 1][oI]);
					octopus.neighbors.push(octopi[rI - 1][oI + 1]);
				} else if(oI === row.length - 1) {
					octopus.neighbors.push(row[oI - 1]);
					octopus.neighbors.push(octopi[rI - 1][oI - 1]);
					octopus.neighbors.push(octopi[rI - 1][oI]);
				} else {
					octopus.neighbors.push(row[oI + 1]);
					octopus.neighbors.push(row[oI - 1]);
					octopus.neighbors.push(octopi[rI - 1][oI - 1]);
					octopus.neighbors.push(octopi[rI - 1][oI]);
					octopus.neighbors.push(octopi[rI - 1][oI + 1]);
				}
			} else {
				if(oI === 0) {
					octopus.neighbors.push(row[oI + 1]);
					octopus.neighbors.push(octopi[rI + 1][oI + 1]);
					octopus.neighbors.push(octopi[rI + 1][oI]);
					octopus.neighbors.push(octopi[rI - 1][oI]);
					octopus.neighbors.push(octopi[rI - 1][oI + 1]);
				} else if(oI === row.length - 1) {
					octopus.neighbors.push(octopi[rI + 1][oI]);
					octopus.neighbors.push(octopi[rI + 1][oI - 1]);
					octopus.neighbors.push(row[oI - 1]);
					octopus.neighbors.push(octopi[rI - 1][oI - 1]);
					octopus.neighbors.push(octopi[rI - 1][oI]);
				} else {
					octopus.neighbors.push(row[oI + 1]);
					octopus.neighbors.push(octopi[rI + 1][oI + 1]);
					octopus.neighbors.push(octopi[rI + 1][oI]);
					octopus.neighbors.push(octopi[rI + 1][oI - 1]);
					octopus.neighbors.push(row[oI - 1]);
					octopus.neighbors.push(octopi[rI - 1][oI - 1]);
					octopus.neighbors.push(octopi[rI - 1][oI]);
					octopus.neighbors.push(octopi[rI - 1][oI + 1]);
				}
			}
		});
	});

	let totalFlash = 0;
	let currentTotal = 0;
	const NUM_OCT = octopi.flat().length;
	let i = 0;
	let steps = [[]];
	let step100Flash;
	octopi.forEach(function(row) {
		let toDisplay = "";
		row.forEach(function(octopus) {
			if(octopus.hasFlashed) {
				octopus.energy = 0;
				toDisplay += " ";
				totalFlash++;
				currentTotal++;
			} else if(octopus.cooldown !== 0) {
				toDisplay += "▒";
				octopus.cooldown--;
			} else {
				toDisplay += "█";
			}
		});
		steps[0].push(toDisplay);
	});
	while(currentTotal !== NUM_OCT) {
		currentTotal = 0;
		i++;
		octopi.forEach(function(row) {
			row.forEach(function(octopus) {
				octopus.hasFlashed = false;
			});
		});

		octopi.forEach(function(row) {
			row.forEach(function(octopus) {
				octopus.increase();
			});
		});

		let thisStep = [];
		octopi.forEach(function(row) {
			let toDisplay = "";
			row.forEach(function(octopus) {
				if(octopus.hasFlashed) {
					octopus.energy = 0;
					toDisplay += " ";
					totalFlash++;
					currentTotal++;
				} else if(octopus.cooldown !== 0) {
					toDisplay += "▒";
					octopus.cooldown--;
				} else {
					toDisplay += "█";
				}
			});
			thisStep.push(toDisplay);
		});
		steps.push(thisStep);
		if(i === 100) {
			displayText(`Total flashes: ${totalFlash}`);
			step100Flash = totalFlash;
		}
	}
	displayText(`Sync time: ${i}`);
	const ANIM_INTERVAL = 1000;
	function animate(step) {
		if(step === steps.length) return;
		let toAnimate = steps[step];
		clearText();
		displayText(`Total flashes: ${step100Flash}`);
		displayText(`Sync time: ${i}`);
		displayText(`Step ${step}:`);
		toAnimate.forEach(displayText);
		setTimeout(animate, ANIM_INTERVAL, ++step);
	}
	animate(0);
	updateCaption(`An animation plays, showing the state of each octopus at each step.`);
	updateCaption(`Octopi that were lit on the previous step are displayed with ▒.`);
	updateCaption(`Octopi that are lit on the current step are displayed with " ".`);
	updateCaption(`Other octopi are displayed with █.`);
	updateCaption(`The total number of flashes is shown: ${step100Flash}`);
	updateCaption(`The sync time is also shown: ${i}`);
}