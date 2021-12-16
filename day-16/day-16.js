"use strict";

function day16(input) {
	//input = `C0015000016115A2E0802F182340`;
	const FILE_REGEX = /(?:\d|[A-F])+/gm;
	let hex;
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		hex = entry[0].split("");
	}

	let bin = hex.reduce(function(acc, value) {
		switch(value) {
			case "0":
				return acc + "0000";
			case "1":
				return acc + "0001";
			case "2":
				return acc + "0010";
			case "3":
				return acc + "0011";
			case "4":
				return acc + "0100";
			case "5":
				return acc + "0101";
			case "6":
				return acc + "0110";
			case "7":
				return acc + "0111";
			case "8":
				return acc + "1000";
			case "9":
				return acc + "1001";
			case "A":
				return acc + "1010";
			case "B":
				return acc + "1011";
			case "C":
				return acc + "1100";
			case "D":
				return acc + "1101";
			case "E":
				return acc + "1110";
			case "F":
				return acc + "1111";
		}
	}, "").split("");
	let binCopy = bin.slice();
	console.log(bin.join(""));
	console.log(hex.join(""));
	console.log(parseInt(bin.join(""), 2));
	console.log(parseInt(hex.join(""), 16));

	function readScope() {
		let rIndex = 0;
		function read(num = 1) {
			if(rIndex + num > bin.length) {
				throw `Asked to read ${num} bit(s), but bin doesn't have that many.`
			}
			let readed = "";
			// What do you mean, the past tense of read is read? :)
			while(num-- > 0) {
				readed += bin[rIndex++];
			}
			return readed;
		}

		function rewind(ind = 0) {
			// Rewinds the pointer to the specified index.
			rIndex = ind;
		}

		return [read, rewind];
	}

	let [read, rewind] = readScope();

	let packets = [];
	function Packet(parent) {
		this.ver;
		this.type;
		this.packetLength;
		this.bitLength;
		this.value;
		this.len = 0;
		this.parent = parent || false;

		this.evaluate = function() {
			this.ver = read(3);
			this.type = read(3);
			console.groupCollapsed(`Packet with ver ${this.ver} and type ${this.type}`);
			this.len += 6;
			if(this.type === "100") {
				// Literal.
				this.value = "";
				while(read() !== "0") {
					this.value += read(4);
					this.len += 5;
				}
				// We hit a zero, but we still have to read 4 more bits.
				this.value += read(4);
				this.len += 5;
				console.log(`Value: ${this.value}`);
				console.groupEnd();
				return parseInt(this.value, 2);
			} else {
				if(read() === "0") {
					// bit length
					this.bitLength = parseInt(read(15), 2);
					this.len += 16;
					console.log(`Child bitlength: ${this.bitLength}`);
					while(this.bitLength !== 0) {
						console.log(`Current length: ${this.bitLength}`);
						let childPacket = new Packet(this);
						packets.push(childPacket);
						childPacket.evaluate();
						this.bitLength -= childPacket.len;
						this.len += childPacket.len;
					}
					console.log(`Length of this packet: ${this.len}`);
					console.groupEnd();
				} else {
					// subpacket length
					this.packetLength = parseInt(read(11), 2);
					this.len += 12;
					console.log(`Child packets: ${this.packetLength}`);
					while(this.packetLength !== 0) {
						let childPacket = new Packet(this);
						packets.push(childPacket);
						childPacket.evaluate();
						this.packetLength--;
						this.len += childPacket.len;
					}
					console.groupEnd();
				}
			}
		}
	}

	packets.push(new Packet());
	packets[0].evaluate();
	let verTotal = packets.reduce(function (acc, packet) {
		return acc + parseInt(packet.ver, 2);
	}, 0);
	displayText(`Version total: ${verTotal}`);


}