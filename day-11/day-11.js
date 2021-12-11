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

		this.increase = function() {
			this.energy++;
			if(!this.hasFlashed && this.energy > 9) {
				this.hasFlashed = true;
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
	for(let i = 1; i <= 100; i++) {
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

		displayText(`Step ${i}`);
		octopi.forEach(function(row) {
			let toDisplay = "";
			row.forEach(function(octopus) {
				if(octopus.hasFlashed) {
					octopus.energy = 0;
					toDisplay += " ";
					totalFlash++;
				} else {
					toDisplay += "█";
				}
			});
			displayText(toDisplay);
		});
		displayText();
	}
	displayText(`Total flashes: ${totalFlash}`);
	updateCaption(`100 maps are displayed, showing which octopi flashed on a given step.`);
	updateCaption(`The total number of flashes is shown: ${totalFlash}`);
}