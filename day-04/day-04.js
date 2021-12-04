"use strict";

function day4(input) {
	const FILE_REGEX = /(?:\d+,?)+\n/g;
	let called = FILE_REGEX.exec(input)[0];
	const BOARD_REGEX = /(?:(?: ?\d+ ?)+\n){5}/g;
	let boards = [];
	let entry;
	while(entry = BOARD_REGEX.exec(input)) {
		boards.push(entry[0].split("\n"));
	}

	function Board(board) {
		this.board = board;
		this.isCalled = [[false, false, false, false, false],
						 [false, false, false, false, false],
						 [false, false, false, false, false],
						 [false, false, false, false, false],
						 [false, false, false, false, false]];

		this.mark = function(number) {
			let temp = this.board.slice().flat();
			let numIndex = temp.findIndex(elem => elem === number);
			if(numIndex === -1) return;
			this.isCalled[Math.floor(numIndex / 5)][numIndex % 5] = true;
		}

		this.victory = function() {
			let victorious = this.isCalled.reduce((acc, value) => acc || value.every(e => e), false);
			if(victorious) {
				let sum = 0;
				for(let i = 0; i < this.isCalled.length; i++) {
					let row = this.isCalled[i];
					for(let j = 0; j < row.length; j++) {
						if(!row[j]) {
							// not called
							sum += this.board[i][j];
						}
					}
				}
				return sum;
			}
			return false;
		}
	}

	boards = boards.map(function(elem) {
		elem = elem.filter(e => e != "");
		for(let i = 0; i < elem.length; i++) {
			elem[i] = elem[i].split(" ");
			elem[i] = elem[i].filter(e => e != "");
			elem[i] = elem[i].map(e => +e);
		}
		return new Board(elem);
	});

	called = called.split(",");
	called = called.map(elem => +elem);
	
	called.forEach(function(elem) {
		boards.forEach(e => e.mark(elem));
		for(let i = 0; i < boards.length; i++) {
			let result = boards[i].victory();
			if(result !== false) {
				displayText(`Bingo! Score: ${result * elem}`);
			}
		}
	});
}