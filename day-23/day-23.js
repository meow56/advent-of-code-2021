"use strict";

function day23(input) {
	/*input = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;/**/
	const FILE_REGEX = /\.+|(#[A-D]){4}/gm;
	let amphipods = [];
	let hallway = FILE_REGEX.exec(input)[0].split("");
	// (But indices 2, 4, 6, and 8 are off limits for occupation.)
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		amphipods.push(entry[0].split("#"));
	}
	console.log(amphipods);
	// ["", "A", "B", "C", "D"]
	let roomA = [[amphipods[0][1], false], [amphipods[1][1], false]];
	let roomB = [[amphipods[0][2], false], [amphipods[1][2], false]];
	let roomC = [[amphipods[0][3], false], [amphipods[1][3], false]];
	let roomD = [[amphipods[0][4], false], [amphipods[1][4], false]];
	roomA[0][1] = roomA[0][0] === "A" && roomA[1][0] === "A";
	roomA[1][1] = roomA[1][0] === "A";
	roomB[0][1] = roomB[0][0] === "B" && roomA[1][0] === "B";
	roomB[1][1] = roomB[1][0] === "B";
	roomC[0][1] = roomC[0][0] === "C" && roomA[1][0] === "C";
	roomC[1][1] = roomC[1][0] === "C";
	roomD[0][1] = roomD[0][0] === "D" && roomA[1][0] === "D";
	roomD[1][1] = roomD[1][0] === "D";
	let minEnergy = 1e308;

	const ENG_COST = new Map([["A", 1], ["B", 10], ["C", 100], ["D", 1000]]);
	const TARGETS = new Map([["A", 2], ["B", 4], ["C", 6], ["D", 8]]);
	function bruteForce(hall, rooms, currCosts) {
		/*console.log(`Hall: ${hall.map(e => e === "." ? e : e[0]).join("")}
Rooms: #${rooms.map(e => e[0]).map(e => e[1] ? e[0] : e[0].toLowerCase()).join("#")}#
       #${rooms.map(e => e[1]).map(e => e[1] ? e[0] : e[0].toLowerCase()).join("#")}#
Current Cost: ${currCosts}`);*/
		let finA = rooms[0][1] !== "." && rooms[0][1][0] === "A" ? 
						(rooms[0][0] !== "." && rooms[0][0][0] === "A" ? 2 : 1) : 0;
		let finB = rooms[1][1] !== "." && rooms[1][1][0] === "B" ? 
						(rooms[1][0] !== "." && rooms[1][0][0] === "B" ? 2 : 1) : 0;
		let finC = rooms[2][1] !== "." && rooms[2][1][0] === "C" ? 
						(rooms[2][0] !== "." && rooms[2][0][0] === "C" ? 2 : 1) : 0;
		let finD = rooms[3][1] !== "." && rooms[3][1][0] === "D" ? 
						(rooms[3][0] !== "." && rooms[3][0][0] === "D" ? 2 : 1) : 0;
		if(finA === 2 && finB === 2 && finC === 2 && finD === 2) {
			minEnergy = Math.min(minEnergy, currCosts);
			return currCosts;
		}
		let futureCosts = 0;
		hall.forEach(function(square, index) {
			if(square !== ".") {
				let moveDist = Math.abs(TARGETS.get(square[0]) - index) + 1;
				futureCosts += moveDist * ENG_COST.get(square[0]);
			}
		});
		if(currCosts + futureCosts > minEnergy) {
			//console.log(`Futures too high.`);
			return;
		}
		let moveA = rooms[0][0] !== "." ? rooms[0][0] : rooms[0][1];
		let moveB = rooms[1][0] !== "." ? rooms[1][0] : rooms[1][1];
		let moveC = rooms[2][0] !== "." ? rooms[2][0] : rooms[2][1];
		let moveD = rooms[3][0] !== "." ? rooms[3][0] : rooms[3][1];

		let destA = [];
		if(moveA !== ".") {
			for(let i = 0; i < hall.length; i++) {
				if(i === 2 || i === 4 || i === 6 || i === 8) continue;
				if(hall[i] === ".") {
					if(i === 0 && hall[1] !== ".") continue;
					if(i > 3 && hall[3] !== ".") continue;
					if(i > 5 && hall[5] !== ".") continue;
					if(i > 7 && hall[7] !== ".") continue;
					if(i === 10 && hall[9] !== ".") continue;
					destA.push(i);
				}
			}
		}
		destA.forEach(function(destination) {
			if(moveA[1]) return;
			let tempHall = hall.slice();
			tempHall[destination] = [moveA[0], true];
			let moveDist = Math.abs(2 - destination) + (rooms[0][0] !== "." ? 1 : 2);
			moveDist *= ENG_COST.get(moveA[0]);
			let newRoom = rooms.slice();
			newRoom[0] = rooms[0][0] !== "." ? [".", rooms[0][1]] : [".", "."];
			bruteForce(tempHall, newRoom, currCosts + moveDist);
		});

		let destB = [];
		if(moveB !== ".") {
			for(let i = 0; i < hall.length; i++) {
				if(i === 2 || i === 4 || i === 6 || i === 8) continue;
				if(hall[i] === ".") {
					if(i < 3 && hall[3] !== ".") continue;
					if(i === 0 && hall[1] !== ".") continue;
					if(i > 5 && hall[5] !== ".") continue;
					if(i > 7 && hall[7] !== ".") continue;
					if(i === 10 && hall[9] !== ".") continue;
					destB.push(i);
				}
			}
		}
		destB.forEach(function(destination) {
			if(moveB[1]) return;
			let tempHall = hall.slice();
			tempHall[destination] = [moveB[0], true];
			let moveDist = Math.abs(4 - destination) + (rooms[1][0] !== "." ? 1 : 2);
			moveDist *= ENG_COST.get(moveB[0]);
			let newRoom = rooms.slice();
			newRoom[1] = rooms[1][0] !== "." ? [".", rooms[1][1]] : [".", "."];
			bruteForce(tempHall, newRoom, currCosts + moveDist);
		});

		let destC = [];
		if(moveC !== ".") {
			for(let i = 0; i < hall.length; i++) {
				if(i === 2 || i === 4 || i === 6 || i === 8) continue;
				if(hall[i] === ".") {
					if(i < 5 && hall[5] !== ".") continue;
					if(i < 3 && hall[3] !== ".") continue;
					if(i === 0 && hall[1] !== ".") continue;
					if(i > 7 && hall[7] !== ".") continue;
					if(i === 10 && hall[9] !== ".") continue;
					destC.push(i);
				}
			}
		}
		destC.forEach(function(destination) {
			if(moveC[1]) return;
			let tempHall = hall.slice();
			tempHall[destination] = [moveC[0], true];
			let moveDist = Math.abs(6 - destination) + (rooms[2][0] !== "." ? 1 : 2);
			moveDist *= ENG_COST.get(moveC[0]);
			let newRoom = rooms.slice();
			newRoom[2] = rooms[2][0] !== "." ? [".", rooms[2][1]] : [".", "."];
			bruteForce(tempHall, newRoom, currCosts + moveDist);
		});

		let destD = [];
		if(moveD !== ".") {
			for(let i = 0; i < hall.length; i++) {
				if(i === 2 || i === 4 || i === 6 || i === 8) continue;
				if(hall[i] === ".") {
					if(i < 7 && hall[7] !== ".") continue;
					if(i < 5 && hall[5] !== ".") continue;
					if(i < 3 && hall[3] !== ".") continue;
					if(i === 0 && hall[1] !== ".") continue;
					if(i === 10 && hall[9] !== ".") continue;
					destD.push(i);
				}
			}
		}
		destD.forEach(function(destination) {
			if(moveD[1]) return;
			let tempHall = hall.slice();
			tempHall[destination] = [moveD[0], true];
			let moveDist = Math.abs(8 - destination) + (rooms[3][0] !== "." ? 1 : 2);
			moveDist *= ENG_COST.get(moveD[0]);
			let newRoom = rooms.slice();
			newRoom[3] = rooms[3][0] !== "." ? [".", rooms[3][1]] : [".", "."];
			bruteForce(tempHall, newRoom, currCosts + moveDist);
		});

		hall.forEach(function(space, index) {
			if(space === ".") return;
			switch(space[0]) {
				case "A":
					if(rooms[0][0] === "." && (rooms[0][1] === "." || rooms[0][1][0] === space[0])) {
						for(let i = Math.min(2, index); i < Math.max(2, index); i++) {
							if(i !== index && hall[i] !== ".") return;
						}
						let newHall = hall.slice();
						newHall[index] = ".";
						let newRooms = rooms.slice();
						let moveDist = Math.abs(2 - index);
						if(rooms[0][1][0] === space[0]) {
							moveDist++;
							moveDist *= ENG_COST.get(space[0]);
							newRooms[0] = [space, space];
						} else {
							moveDist += 2;
							moveDist *= ENG_COST.get(space[0]);
							newRooms[0] = [".", space];
						}
						bruteForce(newHall, newRooms, currCosts + moveDist);
					}
					break;
				case "B":
					if(rooms[1][0] === "." && (rooms[1][1] === "." || rooms[1][1][0] === space[0])) {
						for(let i = Math.min(4, index); i < Math.max(4, index); i++) {
							if(i !== index && hall[i] !== ".") return;
						}
						let newHall = hall.slice();
						newHall[index] = ".";
						let newRooms = rooms.slice();
						let moveDist = Math.abs(4 - index);
						if(rooms[1][1][0] === space[0]) {
							moveDist++;
							moveDist *= ENG_COST.get(space[0]);
							newRooms[1] = [space, space];
						} else {
							moveDist += 2;
							moveDist *= ENG_COST.get(space[0]);
							newRooms[1] = [".", space];
						}
						bruteForce(newHall, newRooms, currCosts + moveDist);
					}
					break;
				case "C":
					if(rooms[2][0] === "." && (rooms[2][1] === "." || rooms[2][1][0] === space[0])) {
						for(let i = Math.min(6, index); i < Math.max(6, index); i++) {
							if(i !== index && hall[i] !== ".") return;
						}
						let newHall = hall.slice();
						newHall[index] = ".";
						let newRooms = rooms.slice();
						let moveDist = Math.abs(6 - index);
						if(rooms[2][1][0] === space[0]) {
							moveDist++;
							moveDist *= ENG_COST.get(space[0]);
							newRooms[2] = [space, space];
						} else {
							moveDist += 2;
							moveDist *= ENG_COST.get(space[0]);
							newRooms[2] = [".", space];
						}
						bruteForce(newHall, newRooms, currCosts + moveDist);
					}
					break;
				case "D":
					if(rooms[3][0] === "." && (rooms[3][1] === "." || rooms[3][1][0] === space[0])) {
						for(let i = Math.min(8, index); i < Math.max(8, index); i++) {
							if(i !== index && hall[i] !== ".") return;
						}
						let newHall = hall.slice();
						newHall[index] = ".";
						let newRooms = rooms.slice();
						let moveDist = Math.abs(8 - index);
						if(rooms[3][1][0] === space[0]) {
							moveDist++;
							moveDist *= ENG_COST.get(space[0]);
							newRooms[3] = [space, space];
						} else {
							moveDist += 2;
							moveDist *= ENG_COST.get(space[0]);
							newRooms[3] = [".", space];
						}
						bruteForce(newHall, newRooms, currCosts + moveDist);
					}
					break;
			}
		});
		//console.log(`This route has no solution.`);
	}
	bruteForce(hallway, [roomA, roomB, roomC, roomD], 0);
	displayText(`Min energy: ${minEnergy}`);
}