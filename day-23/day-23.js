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

	let engCache = new Map();

	function bruteForce(hall, rooms, currCosts) {
		/*console.log(`Hall: ${hall.map(e => e === "." ? e : e[0]).join("")}
Rooms: #${rooms.map(e => e[0]).map(e => e[1] ? e[0] : e[0].toLowerCase()).join("#")}#
       #${rooms.map(e => e[1]).map(e => e[1] ? e[0] : e[0].toLowerCase()).join("#")}#
Current Cost: ${currCosts}`);*/
		let cacheKey = hall.map(e => e === "." ? "." : e[0]).join() + rooms.join();
		if(engCache.has(cacheKey)) {
			minEnergy = Math.min(minEnergy, currCosts + engCache.get(cacheKey));
			return engCache.get(cacheKey);
		}
		let finA = 0;
		for(let i = rooms[0].length - 1; i >= 0; i--) {
			if(rooms[0][i] === ".") break;
			if(rooms[0][i][0] !== "A") break;
			finA++;
		}
		let finB = 0;
		for(let i = rooms[1].length - 1; i >= 0; i--) {
			if(rooms[1][i] === ".") break;
			if(rooms[1][i][0] !== "B") break;
			finB++;
		}
		let finC = 0;
		for(let i = rooms[2].length - 1; i >= 0; i--) {
			if(rooms[2][i] === ".") break;
			if(rooms[2][i][0] !== "C") break;
			finC++;
		}
		let finD = 0;
		for(let i = rooms[3].length - 1; i >= 0; i--) {
			if(rooms[3][i] === ".") break;
			if(rooms[3][i][0] !== "D") break;
			finD++;
		}
		if(finA === rooms[0].length && 
		   finB === rooms[1].length && 
		   finC === rooms[2].length && 
		   finD === rooms[3].length) {
			minEnergy = Math.min(minEnergy, currCosts);
			engCache.set(cacheKey, 0);
			return 0;
		}
		let futureCosts = 0;
		//let moveArr = new Map([["A", moveAI], ["B", moveBI], ["C", moveCI], ["D", moveDI]]);
		hall.forEach(function(square, index) {
			if(square !== ".") {
				let moveDist = Math.abs(TARGETS.get(square[0]) - index) + 1;
				futureCosts += moveDist * ENG_COST.get(square[0]);
			}
		});
		rooms.forEach(function(room, rI) {
			room.forEach(function(square, index) {
				if(square !== ".") {
					if(!square[1]) {
						let moveDist = index + 1 + Math.abs(TARGETS.get(square[0]) - ((rI + 1) * 2)) + 1;
						futureCosts += moveDist * ENG_COST.get(square[0]);
					}
				}
			});
		});
		if(currCosts + futureCosts >= minEnergy) {
			//console.log(`Futures too high.`);
			return 1e308;
		}
		let i = 0;
		let moveA = ".";
		let moveAI;
		while(moveA === "." && i < rooms[0].length) {
			moveAI = i;
			moveA = rooms[0][i++];
		}
		if(moveA === ".") moveAI++;
		i = 0;
		let moveB = ".";
		let moveBI;
		while(moveB === "." && i < rooms[1].length) {
			moveBI = i;
			moveB = rooms[1][i++];
		}
		if(moveB === ".") moveBI++;
		i = 0;
		let moveC = ".";
		let moveCI;
		while(moveC === "." && i < rooms[2].length) {
			moveCI = i;
			moveC = rooms[2][i++];
		}
		if(moveC === ".") moveCI++;
		i = 0;
		let moveD = ".";
		let moveDI;
		while(moveD === "." && i < rooms[3].length) {
			moveDI = i;
			moveD = rooms[3][i++];
		}
		if(moveD === ".") moveDI++;

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

		let possibleEngs = [];
		destA.forEach(function(destination) {
			if(moveA[1]) return;
			let tempHall = hall.slice().map(e => e === "." ? "." : e.slice());
			tempHall[destination] = [moveA[0], true];
			let moveDist = Math.abs(2 - destination) + moveAI + 1;
			moveDist *= ENG_COST.get(moveA[0]);
			let newRoom = rooms.slice().map(e => e === "." ? "." : e.slice());
			newRoom[0][moveAI] = ".";
			possibleEngs.push(moveDist + bruteForce(tempHall, newRoom, currCosts + moveDist));
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
			let tempHall = hall.slice().map(e => e === "." ? "." : e.slice());
			tempHall[destination] = [moveB[0], true];
			let moveDist = Math.abs(4 - destination) + moveBI + 1;
			moveDist *= ENG_COST.get(moveB[0]);
			let newRoom = rooms.slice().map(e => e === "." ? "." : e.slice());
			newRoom[1][moveBI] = ".";
			possibleEngs.push(moveDist + bruteForce(tempHall, newRoom, currCosts + moveDist));
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
			let tempHall = hall.slice().map(e => e === "." ? "." : e.slice());
			tempHall[destination] = [moveC[0], true];
			let moveDist = Math.abs(6 - destination) + moveCI + 1;
			moveDist *= ENG_COST.get(moveC[0]);
			let newRoom = rooms.slice().map(e => e === "." ? "." : e.slice());
			newRoom[2][moveCI] = ".";
			possibleEngs.push(moveDist + bruteForce(tempHall, newRoom, currCosts + moveDist));
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
			let tempHall = hall.slice().map(e => e === "." ? "." : e.slice());
			tempHall[destination] = [moveD[0], true];
			let moveDist = Math.abs(8 - destination) + moveDI + 1;
			moveDist *= ENG_COST.get(moveD[0]);
			let newRoom = rooms.slice().map(e => e === "." ? "." : e.slice());
			newRoom[3][moveDI] = ".";
			possibleEngs.push(moveDist + bruteForce(tempHall, newRoom, currCosts + moveDist));
		});

		hall.forEach(function(space, index) {
			if(space === ".") return;
			switch(space[0]) {
				case "A":
					if(moveAI === rooms[0].length || rooms[0][moveAI][1]) {
						for(let i = Math.min(2, index); i < Math.max(2, index); i++) {
							if(i !== index && hall[i] !== ".") return;
						}
						let newHall = hall.slice().map(e => e === "." ? "." : e.slice());
						newHall[index] = ".";
						let newRooms = rooms.slice().map(e => e === "." ? "." : e.slice());
						let moveDist = Math.abs(2 - index);
						moveDist += moveAI;
						moveDist *= ENG_COST.get(space[0]);
						newRooms[0][moveAI - 1] = space;
						possibleEngs.push(moveDist + bruteForce(newHall, newRooms, currCosts + moveDist));
					}
					break;
				case "B":
					if(moveBI === rooms[1].length || rooms[1][moveBI][1]) {
						for(let i = Math.min(4, index); i < Math.max(4, index); i++) {
							if(i !== index && hall[i] !== ".") return;
						}
						let newHall = hall.slice().map(e => e === "." ? "." : e.slice());
						newHall[index] = ".";
						let newRooms = rooms.slice().map(e => e === "." ? "." : e.slice());
						let moveDist = Math.abs(4 - index);
						moveDist += moveBI;
						moveDist *= ENG_COST.get(space[0]);
						newRooms[1][moveBI - 1] = space;
						possibleEngs.push(moveDist + bruteForce(newHall, newRooms, currCosts + moveDist));
					}
					break;
				case "C":
					if(moveCI === rooms[2].length || rooms[2][moveCI][1]) {
						for(let i = Math.min(6, index); i < Math.max(6, index); i++) {
							if(i !== index && hall[i] !== ".") return;
						}
						let newHall = hall.slice().map(e => e === "." ? "." : e.slice());
						newHall[index] = ".";
						let newRooms = rooms.slice().map(e => e === "." ? "." : e.slice());
						let moveDist = Math.abs(6 - index);
						moveDist += moveCI;
						moveDist *= ENG_COST.get(space[0]);
						newRooms[2][moveCI - 1] = space;
						possibleEngs.push(moveDist + bruteForce(newHall, newRooms, currCosts + moveDist));
					}
					break;
				case "D":
					if(moveDI === rooms[3].length || rooms[3][moveDI][1]) {
						for(let i = Math.min(8, index); i < Math.max(8, index); i++) {
							if(i !== index && hall[i] !== ".") return;
						}
						let newHall = hall.slice().map(e => e === "." ? "." : e.slice());
						newHall[index] = ".";
						let newRooms = rooms.slice().map(e => e === "." ? "." : e.slice());
						let moveDist = Math.abs(8 - index);
						moveDist += moveDI;
						moveDist *= ENG_COST.get(space[0]);
						newRooms[3][moveDI - 1] = space;
						possibleEngs.push(moveDist + bruteForce(newHall, newRooms, currCosts + moveDist));
					}
					break;
			}
		});
		if(possibleEngs.length === 0) {
			//console.log(`This route has no solution.`);
			engCache.set(cacheKey, 1e308);
			return 1e308;
		} else {
			engCache.set(cacheKey, Math.min(...possibleEngs));
			return Math.min(...possibleEngs);
		}
	}
	bruteForce(hallway.slice(), [roomA.slice(), roomB.slice(), roomC.slice(), roomD.slice()], 0);
	displayText(`Min energy: ${minEnergy}`);
	//throw `:(`;
	minEnergy = 1e308;
	roomA[0][1] = false;
	roomA[1][1] = roomA[1][0] === "A";
	roomB[0][1] = false;
	roomB[1][1] = roomB[1][0] === "B";
	roomC[0][1] = false;
	roomC[1][1] = roomC[1][0] === "C";
	roomD[0][1] = false;
	roomD[1][1] = roomD[1][0] === "D";
	roomA.splice(1, 0, ["D", false], ["D", false]);
	roomB.splice(1, 0, ["C", false], ["B", false]);
	roomC.splice(1, 0, ["B", false], ["A", false]);
	roomD.splice(1, 0, ["A", false], ["C", false]);
	bruteForce(hallway.slice(), [roomA.slice(), roomB.slice(), roomC.slice(), roomD.slice()], 0);
	displayText(`Min energy, 2!: ${minEnergy}`);
}