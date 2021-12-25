"use strict";

function day25(input) {
	/*input = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;/**/
	const FILE_REGEX = /(?:\.|>|v)+/gm;
	let cucumbers = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		cucumbers.push(entry[0].split(""));
	}

	let previousResult = "";
	let stepCount = 1;
	let display = [];
	while(previousResult !== cucumbers.flat().join()) {
		previousResult = cucumbers.flat().join();
		let nextStep = [];
		for(let i = 0; i < cucumbers.length; i++) {
			nextStep.push(new Array(cucumbers[i].length).fill("."));
		}
		for(let i = 0; i < cucumbers.length; i++) {
			for(let j = 0; j < cucumbers[i].length; j++) {
				if(cucumbers[i][j] === "v") {
					nextStep[i][j] = cucumbers[i][j];
					continue;
				} else if(cucumbers[i][j] === ".") {
					continue;
				}
				let target = [i, (j + 1) % cucumbers[i].length];
				if(cucumbers[target[0]][target[1]] !== ".") {
					nextStep[i][j] = ">";
				} else {
					nextStep[target[0]][target[1]] = ">";
					nextStep[i][j] = ".";
				}
			}
		}
		cucumbers = nextStep;
		nextStep = [];
		for(let i = 0; i < cucumbers.length; i++) {
			nextStep.push(new Array(cucumbers[i].length).fill("."));
		}
		for(let i = 0; i < cucumbers.length; i++) {
			for(let j = 0; j < cucumbers[i].length; j++) {
				if(cucumbers[i][j] === ">") {
					nextStep[i][j] = cucumbers[i][j];
					continue;
				} else if(cucumbers[i][j] === ".") {
					continue;
				}
				let target = [(i + 1) % cucumbers.length, j];
				if(cucumbers[target[0]][target[1]] !== ".") {
					nextStep[i][j] = "v";
				} else {
					nextStep[target[0]][target[1]] = cucumbers[i][j];
					nextStep[i][j] = ".";
				}
			}
		}
		cucumbers = nextStep;
		display.push(cucumbers.slice().map(e => e.slice()));
	}

	for(let j = 0; j < display.length; j += 10) {
		displayText(`Step ${j + 1}:`);
		for(let i = 0; i < display[j].length; i++) {
			displayText(display[j][i].join(""));
		}
	}

	const CHM_CLR = ["#cf2501", "#0dc92c", "#ffffff"];
	function christmas(text) {
		let newText = "";
		let formatting = [];
		for(let i = 0; i < text.length; i++) {
			newText += "%c";
			newText += text[i];
			formatting.push("color:" + CHM_CLR[i % CHM_CLR.length]);
		}
		console.log(newText, ...formatting);
	}
	christmas(`Merry Christmas and Happy Holidays!`);
}