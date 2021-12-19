"use strict";

function day18(input) {
	/*input = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`;/**/
	const FILE_REGEX = /(?:\[|\]|\d|,)+/gm;
	let numbers = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		numbers.push(entry[0]);
	}
	// too low: 166
	console.log(numbers);

	function decToBin(num) {
		let bin = "";
		while(num !== 0) {
			if(num % 2 === 1) {
				bin += "1";
				num = (num - 1) / 2;
			} else {
				bin += "0";
				num /= 2;
			}
		}
		return bin.split("").reverse().join("");
	}


	function reduce(num) {
		let finished = false;
		while(!finished) {
			finished = true;
			for(let i = 0; i < num.length; i++) {
				if(num[i][0] > 4) {
					finished = false;
					// Explode!
					// num[i + 1] must be the other item in the pair.
					if(num[i + 1][0] !== num[i][0]) {
						throw `I thought ${num[i]} and ${num[i + 1]} were a pair, but they aren't.`;
					}

					if(i === 0) {
						// No left number.
						num[i + 2][1] += num[i + 1][1];
						num.splice(i, 2, [num[i][0] - 1, 0]);
						i--; // to realign.
					} else if(i === num.length - 2) {
						// No right number.
						num[i - 1][1] += num[i][1];
						num.splice(i, 2, [num[i][0] - 1, 0]);
						i--; // realign again.
						// though we're at the end of the array, so whatever.
					} else {
						num[i - 1][1] += num[i][1];
						num[i + 2][1] += num[i + 1][1];
						num.splice(i, 2, [num[i][0] - 1, 0]);
					}
				}
			}

			for(let i = 0; i < num.length; i++) {
				if(num[i][1] > 9) {
					finished = false;
					// Split!
					num.splice(i, 1, [num[i][0] + 1, Math.floor(num[i][1] / 2)],
									 [num[i][0] + 1, Math.ceil(num[i][1] / 2)]);
					break;
					// We need to make sure any explosions happen first.
				}
			}
		}
		return num;
	}

	function TreeNode(id) {
		this.id = id;
		this.parent = "None";
		this.children = [];
		this.value; // only filled for non-parents.

		this.findId = function(id) {
			if(id === "") return this;
			if(id[0] === "0") return this.children[0].findId(id.slice(1));
			return this.children[1].findId(id.slice(1));
		}

		this.getNeigh = function(left, maxNode, checked = []) {
			// left: true or false. prefer the left neighbor
			if(maxNode === this.id) return;
			if(this.value || this.value === 0) return this;
			checked.push(this.id);
			if(this.children.length !== 0) {
				if(left) {
					if(checked.includes(this.children[0].id)) {
						if(checked.includes(this.children[1].id)) {
							return this.parent.getNeigh(left, maxNode, checked);
						} else {
							return this.children[1].getNeigh(left, maxNode, checked);
						}
					} else {
						return this.children[0].getNeigh(left, maxNode, checked);
					}
				} else {
					if(checked.includes(this.children[1].id)) {
						if(checked.includes(this.children[0].id)) {
							return this.parent.getNeigh(left, maxNode, checked);
						} else {
							return this.children[0].getNeigh(left, maxNode, checked);
						}
					} else {
						return this.children[1].getNeigh(left, maxNode, checked);
					}
				}
			} else {
				return this.parent.getNeigh(left, maxNode, checked);
			}
		}
	}

	function Tree() {
		this.nodes = [];

		this.displayTree = function() {
			/*                                                               01
			 *                               02                                                              03
			 *               04                              05                              06                              07
			 *       08              09              10              11              12              13              14              15
			 *   16      17      18      19      20      21      22      23      24      25      26      27      28      29      30      31
			 * 32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50  51  52  53  54  55  56  57  58  59  60  61  62  63
			 */
			let noDi= [];
			for(let i = 0; i < this.nodes.length; i++) {
				noDi[i] = this.nodes[i].value || this.nodes[i].value === 0 ? this.nodes[i].value.toString().padStart(2, "0") : "__";
			}
			displayText(`                                                              ${noDi[0]}`);
			displayText(`                              ${noDi[1]}                                                              ${noDi[2]}`);
			displayText(`              ${noDi[3]}                              ${noDi[4]}                              ${noDi[5]}                              ${noDi[6]}`);
			displayText(`      ${noDi[7]}              ${noDi[8]}              ${noDi[9]}              ${noDi[10]}              ${noDi[11]}              ${noDi[12]}              ${noDi[13]}              ${noDi[14]}`);
			displayText(`  ${noDi[15]}      ${noDi[16]}      ${noDi[17]}      ${noDi[18]}      ${noDi[19]}      ${noDi[20]}      ${noDi[21]}      ${noDi[22]}      ${noDi[23]}      ${noDi[24]}      ${noDi[25]}      ${noDi[26]}      ${noDi[27]}      ${noDi[28]}      ${noDi[29]}      ${noDi[30]}`);
			if(this.nodes.length > 32) {
			displayText(`${noDi[31]}  ${noDi[32]}  ${noDi[33]}  ${noDi[34]}  ${noDi[35]}  ${noDi[36]}  ${noDi[37]}  ${noDi[38]}  ${noDi[39]}  ${noDi[40]}  ${noDi[41]}  ${noDi[42]}  ${noDi[43]}  ${noDi[44]}  ${noDi[45]}  ${noDi[46]}  ${noDi[47]}  ${noDi[48]}  ${noDi[49]}  ${noDi[50]}  ${noDi[51]}  ${noDi[52]}  ${noDi[53]}  ${noDi[54]}  ${noDi[55]}  ${noDi[56]}  ${noDi[57]}  ${noDi[58]}  ${noDi[59]}  ${noDi[60]}  ${noDi[61]}  ${noDi[62]}`);
			}
			displayText();
		}

		this.populate = function(num) {
			for(let i = 1; i < num; i++) {
				this.nodes.push(new TreeNode(i));
			}
			for(let i = 2; i < num; i++) {
				this.nodes[i - 1].parent = this.nodes[Math.floor(i / 2) - 1];
			}
		}

		this.setNode = function(id, value) {
			this.nodes[id - 1].value = value;
		}

		this.merge = function(toAdd) {
			let newNodes = [];
			newNodes.push(new TreeNode(1));
			for(let i = 0; i < this.nodes.length; i++) {
				let nodeDepth = Math.floor(Math.log2(i + 1));
				let offset = i + 1 - (2 ** nodeDepth);
				this.nodes[i].id = (2 ** (nodeDepth + 1)) + offset;
				newNodes.push(this.nodes[i]);
			}
			for(let i = 0; i < toAdd.length; i++) {
				let nodeDepth = Math.floor(Math.log2(i + 1));
				let offset = i + 1;
				toAdd[i].id = (2 ** (nodeDepth + 1)) + offset;
				newNodes.push(toAdd[i]);
			}
			newNodes.sort((a, b) => a.id - b.id);
			for(let i = 0; i < 63; i++) {
				newNodes[i].children = [];
			}
			for(let i = 2; i < 64; i++) {
				newNodes[i - 1].parent = newNodes[Math.floor(i / 2) - 1];
				newNodes[Math.floor(i / 2) - 1].children.push(newNodes[i - 1]);
			}
			this.nodes = newNodes;
			//displayText(`After merging.`);
			//this.displayTree();
		}

		this.reduce = function() {
			let explodes = function(i) {
				if(this.nodes[i - 1].value || this.nodes[i - 1].value === 0) {
					// explode!
					if(!this.nodes[i].value && this.nodes[i].value !== 0) {
						throw `Thought ${i} and ${i + 1} were a pair, but I guess not.`
					}
					if(i === 32) {
						// No left neighbor.
						let rNeigh = this.nodes[i + 1].getNeigh(true, this.nodes[i - 1].parent.id);
						rNeigh.value += this.nodes[i].value;
						this.nodes[i - 1].value = undefined;
						this.nodes[i].value = undefined;
						this.nodes[i].parent.value = 0;
					} else if(i === 62) {
						// No right neighbor.
						let lNeigh = this.nodes[i - 2].getNeigh(false, this.nodes[i - 1].parent.id);
						lNeigh.value += this.nodes[i - 1].value;
						this.nodes[i - 1].value = undefined;
						this.nodes[i].value = undefined;
						this.nodes[i].parent.value = 0;
						return lNeigh.id;
					} else {
						let lNeigh = this.nodes[i - 2].getNeigh(false, this.nodes[i - 1].parent.id);
						let rNeigh = this.nodes[i + 1].getNeigh(true, this.nodes[i - 1].parent.id);
						lNeigh.value += this.nodes[i - 1].value;
						rNeigh.value += this.nodes[i].value;
						this.nodes[i - 1].value = undefined;
						this.nodes[i].value = undefined;
						this.nodes[i].parent.value = 0;
						return lNeigh.id;
					}
				} else {
					// no explosion.
					// we'll delete it later--split might use these.
				}
			}.bind(this);


			for(let i = 32; i < 64; i++) {
				// i stands for... IDs
				explodes(i);
			}
			//displayText(`After explosions.`);
			//this.displayTree();

			const CHECK_ORDER = [16, 8, 17, 4, 18, 9, 19, 2, 20, 10, 21, 5, 22, 11, 23, 1, 24, 12, 25, 6, 26, 13, 27, 3, 28, 14, 29, 7, 30, 15, 31];
			for(let i = 0; i < CHECK_ORDER.length; i++) {
				// i stands for... index into CHECK_ORDER
				if(this.nodes[CHECK_ORDER[i] - 1].value && this.nodes[CHECK_ORDER[i] - 1].value > 9) {
					// split!
					this.nodes[CHECK_ORDER[i] - 1].children[0].value = Math.floor(this.nodes[CHECK_ORDER[i] - 1].value / 2);
					this.nodes[CHECK_ORDER[i] - 1].children[1].value = Math.ceil(this.nodes[CHECK_ORDER[i] - 1].value / 2);
					this.nodes[CHECK_ORDER[i] - 1].value = undefined;

					//displayText(`After a split.`);
					//this.displayTree();
					// Then we have to check if it explodes...
					this.nodes[CHECK_ORDER[i] - 1].children[0].id > 31 ? explodes(this.nodes[CHECK_ORDER[i] - 1].children[0].id) : false;
					i = -1;
					// - 1 since i++ happens right after this.
					//displayText(`After a split's explosion check.`);
					//this.displayTree();
				}
			}

			this.nodes.splice(31);
			// Delete all nodes from ID 32 to the end.

		}
	}



	numbers = numbers.map(function(num) {
		let tree = new Tree();
		tree.populate(32);
		/*                               01
		 *               02                              03
		 *       04              05              06              07
		 *   08      09      10      11      12      13      14      15
		 * 16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31
		 */

		let path = "10";
		for(let i = 1; i < num.length - 1; i++) {
			switch(num[i]) {
				case "[":
					path += "0";
					break;
				case "]":
					path = path.slice(0, -1);
					break;
				case "0":
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					tree.setNode(parseInt(path, 2), +num[i]);
					break;
				case ",":
					path = path.slice(0, -1) + "1";
					break;
				default:
					throw `Unknown character ${num[i]}`;
			}
		}

		return tree;
	});

	while(numbers.length !== 1) {
		numbers[0].merge(numbers[1].nodes);
		numbers[0].reduce();
		numbers.splice(1, 1);
		displayText(`~~~~~~~~~~FINAL TREE~~~~~~~~~~`);
		numbers[0].displayTree();
		//throw `Hold on`;
	}

	function calcMag(node) {
		if(node.value || node.value === 0) return node.value;
		return (3 * calcMag(node.children[0])) + (2 * calcMag(node.children[1]));
	}

	displayText(`Final mag: ${calcMag(numbers[0].nodes[0])}`);
}