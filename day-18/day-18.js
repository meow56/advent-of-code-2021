"use strict";

function day18(input) {
	/*input = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;/**/
	const FILE_REGEX = /(?:\[|\]|\d|,)+/gm;
	let numbers = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		numbers.push(entry[0]);
	}
	// too high: 4796

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

	function Tree(nodes) {
		this.nodes = nodes || [];

		this.displayTree = function() {
			let noDi = [];
			for(let i = 0; i < this.nodes.length; i++) {
				noDi[i] = this.nodes[i].value || this.nodes[i].value === 0 ? this.nodes[i].value.toString().padStart(2, "0") : "__";
			}
			let maxDepth = Math.floor(Math.log2(this.nodes.length + 1));
			for(let i = 1; i <= maxDepth; i++) {
				let lowBound = (2 ** (i - 1)) - 1; // - 1: zero-based index
				let upBound = (2 ** i) - 1;
				let toDisplay = " ".repeat((2 ** (maxDepth - i + 1)) - 2);
				for(let j = lowBound; j < upBound; j++) {
					toDisplay += noDi[j];
					toDisplay += " ".repeat((2 ** (maxDepth - i + 2)) - 2);
				}
				displayText(toDisplay.trimEnd());
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
		}

		this.dup = function() {
			let newNodes = [];
			for(let i = 0; i < this.nodes.length; i++) {
				newNodes.push(new TreeNode(i + 1));
				newNodes[i].value = this.nodes[i].value;
			}
			for(let i = 2; i < newNodes.length; i++) {
				newNodes[i - 1].parent = newNodes[Math.floor(i / 2) - 1];
			}
			return new Tree(newNodes);
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

			const CHECK_ORDER = [16, 8, 17, 4, 18, 9, 19, 2, 20, 10, 21, 5, 22, 11, 23, 1, 
								 24, 12, 25, 6, 26, 13, 27, 3, 28, 14, 29, 7, 30, 15, 31];
			for(let i = 0; i < CHECK_ORDER.length; i++) {
				// i stands for... index into CHECK_ORDER
				if(this.nodes[CHECK_ORDER[i] - 1].value && this.nodes[CHECK_ORDER[i] - 1].value > 9) {
					// split!
					this.nodes[CHECK_ORDER[i] - 1].children[0].value = Math.floor(this.nodes[CHECK_ORDER[i] - 1].value / 2);
					this.nodes[CHECK_ORDER[i] - 1].children[1].value = Math.ceil(this.nodes[CHECK_ORDER[i] - 1].value / 2);
					this.nodes[CHECK_ORDER[i] - 1].value = undefined;

					// Then we have to check if it explodes...
					this.nodes[CHECK_ORDER[i] - 1].children[0].id > 31 ? explodes(this.nodes[CHECK_ORDER[i] - 1].children[0].id) : false;
					i = -1;
					// - 1 since i++ happens right after this.
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

	let numSums = [];
	for(let k = 0; k < numbers.length; k++) {
		for(let l = 0; l < numbers.length; l++) {
			if(k !== l) {
				let newSum = numbers[k].dup()
				newSum.merge(numbers[l].dup().nodes);
				newSum.reduce();
				numSums.push(calcMag(newSum.nodes[0]));
			}
		}
	}
	let maxSum = Math.max(...numSums);

	let sumCount = 1;
	while(numbers.length !== 1) {
		numbers[0].merge(numbers[1].nodes);
		numbers[0].reduce();
		numbers.splice(1, 1);
		displayText(`Tree after summing 0 and ${sumCount++}:`);
		numbers[0].displayTree();
	}

	function calcMag(node) {
		if(node.value || node.value === 0) {
			return node.value;
		}
		let nodeMag = (3 * calcMag(node.children[0])) + (2 * calcMag(node.children[1]));
		return nodeMag;
	}

	displayText(`Final mag: ${calcMag(numbers[0].nodes[0])}`);
	displayText(`Max sum: ${maxSum}`);
	updateCaption(`A number of binary trees are displayed.`);
	updateCaption(`Each one represents the result of summing the first two elements of the list.`);
	updateCaption(`The magnitude of the last tree is ${calcMag(numbers[0].nodes[0])}.`);
	updateCaption(`Meanwhile, the max magnitude obtained from summing two elements is ${maxSum}.`);
}