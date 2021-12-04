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
		this.isVictorious = false;

		this.mark = function(number) {
			if(this.isVictorious) return;
			let temp = this.board.slice().flat();
			let numIndex = temp.findIndex(elem => elem === number);
			if(numIndex === -1) return;
			this.isCalled[Math.floor(numIndex / 5)][numIndex % 5] = true;
		}

		this.victory = function() {
			if(this.isVictorious) return false;
			let victorious = this.isCalled.reduce((acc, value) => acc || value.every(e => e), false);
			for(let i = 0; i < this.isCalled[0].length; i++) {
				let vertorious = true;
				for(let j = 0; j < this.isCalled.length; j++) {
					if(!this.isCalled[j][i]) {
						vertorious = false;
					}
				}
				victorious = victorious || vertorious;
			}
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
				this.isVictorious = true;
				return sum;
			}
			return false;
		}

		this.display = function() {
			for(let i = 0; i < this.isCalled.length; i++) {
				let row = this.isCalled[i];
				let toDisp = "";
				for(let j = 0; j < row.length; j++) {
					if(row[j]) {
						if(this.board[i][j].toString().length === 1) {
							toDisp += `!0${this.board[i][j]}!`;
						} else {
							toDisp += `!${this.board[i][j]}!`;
						}
					} else {
						if(this.board[i][j].toString().length === 1) {
							toDisp += `-0${this.board[i][j]}-`;
						} else {
							toDisp += `-${this.board[i][j]}-`;
						}
					}
				}
				displayText(toDisp);
			}
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
				displayText(`Bingo on board ${i}! Score: ${result * elem}`);
				displayText(`Board:`);
				boards[i].display();
			}
		}
	});
}