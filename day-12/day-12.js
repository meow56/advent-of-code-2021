"use strict";

function day12(input) {
	/*input = ``;*/
	const FILE_REGEX = /[a-zA-Z]+-[a-zA-z]+/gm;
	let caves = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		let working = entry[0].split("-");
		let cave0 = caves.find(cave => cave.name === working[0]) || new Cave(working[0]);
		let cave1 = caves.find(cave => cave.name === working[1]) || new Cave(working[1]);
		cave0.addConnection(cave1);
		cave1.addConnection(cave0);
		if(typeof caves.find(cave => cave.name === working[0]) === "undefined") {
			caves.push(cave0);
		}
		if(typeof caves.find(cave => cave.name === working[1]) === "undefined") {
			caves.push(cave1);
		}
	}

	function Cave(name) {
		this.name = name;
		this.isBig = false;
		if(this.name === this.name.toUpperCase()) {
			this.isBig = true;
		}
		this.connections = [];

		this.addConnection = function(cave) {
			if(typeof this.connections.find(path => path.name === cave.name) === "undefined") {
				this.connections.push(cave);
			}
		}
	}

	function findPaths(curCave, visited) {
		// curCave: the current Cave we are in
		// visited: array of Caves already visited
		if(curCave.name === "end") return [visited];
		let futurePaths = [];
		curCave.connections.forEach(function(destination) {
			if(destination.isBig) {
				let newVisited = visited.slice();
				newVisited.push(curCave);
				futurePaths.push(findPaths(destination, newVisited));
			} else if(typeof visited.find(seenBefore => seenBefore.name === destination.name) === "undefined") {
				// It's small, but we haven't seen it yet.
				let newVisited = visited.slice();
				newVisited.push(curCave);
				futurePaths.push(findPaths(destination, newVisited));
			} else {
				// It's small, and we've seen it before.
			}
		});
		if(futurePaths.length === 0) {
			// We're stuck :(
			return [];
		} else {
			return futurePaths.flat().map(path => [curCave].concat(path));
		}
	}

	let paths;
	for(let i = 0; i < caves.length; i++) {
		if(caves[i].name === "start") {
			paths = findPaths(caves[i], []);
		}
	}
	displayText(`Number of paths: ${paths.length}`);
	updateCaption(`The number of paths from start to end is displayed: ${paths.length}`);
}