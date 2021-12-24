"use strict";

function day24(input) {
	/*input = ``;/**/
	const FILE_REGEX = /([a-z]+) ([w-z]) ?([w-z]|(?:-?\d+))?/gm;
	let instructions = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		instructions.push([entry[1], entry[2], entry[3]]);
	}

	function rTZ(n) {
		return n >= 0 ? Math.floor(n) : -1 * Math.floor(-n);
	}

	function compile() {
		let vars = new Map();
		vars.set("w", 0);
		vars.set("x", 0);
		vars.set("y", 0);
		vars.set("z", 0);
		let instPointer = 0;
		let inpPointer = 0;
		function execute(inputStream) {
			for(let i = 1; i < inputStream.length; i++) {
				if(evalCache.has(`${inputStream.slice(0, i)}`)) {
					let cachedResults = evalCache.get(`${inputStream.slice(0, i)}`).split(",");
					cachedResults = cachedResults.map(e => +e);
					let [z, newInstPoint] = cachedResults;
					vars.set("z", z);
					if(z > divZ[i]) return vars;
					instPointer = newInstPoint;
					inpPointer = i;
				}
			}
			while(instPointer < instructions.length) {
				//console.log(vars);
				let inst = instructions[instPointer++];
				let arg2 = parseInt(inst[2], 10) || vars.get(inst[2]);
				if(typeof arg2 === "undefined") arg2 = 0;
				switch(inst[0]) {
					case "inp":
						if(!evalCache.has(`${inputStream.slice(0, inpPointer)}`) && 
							inpPointer !== 0 && inpPointer !== inputStream.length - 1) {
							let z = vars.get("z");
							evalCache.set(`${inputStream.slice(0, inpPointer)}`, 
								`${z},${instPointer}`);
						}
						if(vars.get("z") > divZ[inpPointer]) return vars;
						vars.set(inst[1], inputStream[inpPointer++]);
						break;
					case "add":
						vars.set(inst[1], vars.get(inst[1]) + arg2);
						break;
					case "mul":
						vars.set(inst[1], vars.get(inst[1]) * arg2);
						break;
					case "div":
						if(arg2 === 0) throw `Divide by zero error`;
						vars.set(inst[1], rTZ(vars.get(inst[1]) / arg2));
						break;
					case "mod":
						if(arg2 === 0) throw `Divide by zero error`;
						if(vars.get(inst[1]) < 0 || arg2 < 0) throw `Negative value passed to mod`;
						vars.set(inst[1], vars.get(inst[1]) % arg2);
						break;
					case "eql":
						vars.set(inst[1], +(vars.get(inst[1]) === arg2));
						break;
					default:
						throw `Unknown instruction ${inst[0]}`;
				}
			}
			return vars;
		}

		function specEx() {
			while(instPointer < instructions.length) {
				let inst = instructions[instPointer++];
				let arg1 = vars.get(inst[1]);
				let arg2 = parseInt(inst[2], 10) || vars.get(inst[2]);
				if(typeof arg2 === "undefined") arg2 = 0;
				let takeArg = 0;
				switch(inst[0]) {
					case "inp":
						vars.set(inst[1], [takeArg++]);
						break;
					case "add":
						if(arg1 === 0) {
							vars.set(inst[1], arg2);
						} else if(arg2 === 0) {

						} else if(typeof arg1 === "object" || typeof arg2 === "object") {
							vars.set(inst[1], ["+", arg1, arg2]);
						} else {
							vars.set(inst[1], arg1 + arg2);
						}
						break;
					case "mul":
						if(arg1 === 0 || arg2 === 0) {
							vars.set(inst[1], 0);
						} else if(arg2 === 1) {

						} else if(arg1 === 1) {
							vars.set(inst[1], arg2);
						} else if(typeof arg1 === "object" || typeof arg2 === "object") {
							vars.set(inst[1], ["*", arg1, arg2]);
						} else {
							vars.set(inst[1], arg1 * arg2);
						}
						break;
					case "div":
						if(arg1 === 0 || arg2 === 1) {

						} else if(typeof arg1 === "object" || typeof arg2 === "object") {
							vars.set(inst[1], ["/", arg1, arg2]);
						} else {
							if(arg2 === 0) throw `Divide by zero error`;
							vars.set(inst[1], rTZ(arg1 / arg2));
						}
						break;
					case "mod":
						if(arg1 === 0 || arg2 === 1) {
							
						} else if(arg1 === "object" || typeof arg2 === "object") {
							if(typeof arg1 === "object" && arg1[0] === "+") {
								if(typeof arg1[1] === "object" && arg1[1].length === 1) {
									if(typeof arg1[2] === "number" && arg1[2] <= arg2 - 10) {
										// Since [*] is from 1-9,
										// % will never fire.
									}
								}
							}
							vars.set(inst[1], ["%", arg1, arg2]);
						} else {
							if(arg2 === 0) throw `Divide by zero error`;
							if(arg1 < 0 || arg2 < 0) throw `Negative value passed to mod`;
							vars.set(inst[1], arg1 % arg2);
						}
						break;
					case "eql":
						if(typeof arg1 === "object" || typeof arg2 === "object") {
							if(typeof arg2 === "object" && arg2.length === 1) {
								if(typeof arg1 !== "object" && arg1 > 9) {
									// [*] will never be greater than 9.
									vars.set(inst[1], 0);
								} else {
									vars.set(inst[1], ["=", arg1, arg2]);
								}
							} else {
								vars.set(inst[1], ["=", arg1, arg2]);
							}
						} else {
							vars.set(inst[1], +(arg1 === arg2));
						}
						break;
					default:
						throw `Unknown instruction ${inst[0]}`;
				}
			}
			return vars;
		}

		function reset() {
			vars.set("w", 0);
			vars.set("x", 0);
			vars.set("y", 0);
			vars.set("z", 0);
			instPointer = 0;
			inpPointer = 0;
		}

		return [execute, reset, specEx];
	}
	let [execute, reset, specEx] = compile();
	//let futures = specEx();
	//console.log(JSON.parse(JSON.stringify(futures.get("z"))));
	//console.log(futures.get("z"));
	function evaluate(command, inputStream) {
		if(typeof command === "number") return command;
		if(command.length === 1) return inputStream[command[0]];
		let arg0 = command[0];
		let arg1 = evaluate(command[1], inputStream);
		if(typeof arg1 === "undefined") return;
		let arg2 = evaluate(command[2], inputStream);
		if(typeof arg2 === "undefined") return;
		command[1] = arg1;
		command[2] = arg2;
		switch(arg0) {
			case "+":
				return arg1 + arg2;
			case "*":
				return arg1 * arg2;
			case "/":
				return rTZ(arg1 / arg2);
			case "%":
				return arg1 % arg2;
			case "=":
				return +(arg1 === arg2);
			default:
				throw `Unknown command ${arg0}`;
		}
	}
	let subNum = 99999999999999;
	let highSubNum = 0;
	let evalCache = new Map();
	function unshallowCopy(array) {
		return array.slice().map(e => typeof e === "object" ? unshallowCopy(e) : e);
	}
	//let instCopy = unshallowCopy(futures.get("z"));
	//evaluate(instCopy, [1]);
	//console.log(instCopy);
	//throw '1';
	for(let i = 1; i <= 14; i++) {
		let inpStr = new Array(i);
		for(let j = 1; j <= 9; j++) {
			inpStr.fill(j);
		}
	}
	let divZ = instructions.filter(e => e[0] === "div" && e[1] === "z").map(e => e[2]);
	divZ = divZ.map(function(num, index) {
		let temp = 1;
		for(let i = index; i < divZ.length; i++) {
			temp *= divZ[i];
		}
		return temp;
	});
	while(subNum < 100000000000000) {
		if(subNum % 100000 === 0) console.log(subNum);
		let inpStr = subNum.toString().split("").map(e => +e);
		if(inpStr.some(e => e === 0)) {
			subNum--;
			continue;
		}
		reset();
		let result = execute(inpStr);
		if(result.get("z") === 0) {
			highSubNum = subNum;
			break;
		}
		subNum--;
	}
	displayText(`Highest number: ${highSubNum}`);
}