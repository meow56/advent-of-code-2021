"use strict";

function day16(input) {
	//input = `9C0141080250320F1802104A08`;
	// too low: 333434623067, 
	//           61337102730
	// doh!!!
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
		this.childPackets = [];

		this.evaluate = function(spacer = "") {
			this.ver = read(3);
			this.type = read(3);
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
				this.value = parseInt(this.value, 2);
				displayText(`${spacer}Literal value: ${this.value}`);
				//console.groupEnd();
			} else {
				displayText(`${spacer}Packet with type ${parseInt(this.type, 2)}`);
				if(read() === "0") {
					// bit length
					this.bitLength = parseInt(read(15), 2);
					this.len += 16;
					while(this.bitLength !== 0) {
						let childPacket = new Packet(this);
						this.childPackets.push(childPacket);
						packets.push(childPacket);
						childPacket.evaluate(spacer + "  ");
						this.bitLength -= childPacket.len;
						this.len += childPacket.len;
					}
				} else {
					// subpacket length
					this.packetLength = parseInt(read(11), 2);
					this.len += 12;
					while(this.packetLength !== 0) {
						let childPacket = new Packet(this);
						this.childPackets.push(childPacket);
						packets.push(childPacket);
						childPacket.evaluate(spacer + "  ");
						this.packetLength--;
						this.len += childPacket.len;
					}
				}

				spacer += "  ";
				let toDisplay;
				switch(this.type) {
					case "000":
						[this.value, toDisplay] = this.childPackets.reduce((function(acc, pack, index, arr) {
							let temp;
							if(index === 0) {
								temp = `${arr.length === 1 ? "0 + " : ""}${pack.value}`;
							} else {
								temp = ` + ${pack.value}`;
							}
							return [acc[0] + pack.value, acc[1] + temp];
						}), [0, ""]);
						displayText(spacer + toDisplay);
						break;
					case "001":
						[this.value, toDisplay] = this.childPackets.reduce((function(acc, pack, index, arr) {
							let temp;
							if(index === 0) {
								temp = `${arr.length === 1 ? "1 * " : ""}${pack.value}`;
							} else {
								temp = ` * ${pack.value}`;
							}
							return [acc[0] * pack.value, acc[1] + temp];
						}), [1, ""]);
						displayText(spacer + toDisplay);
						break;
					case "010":
						displayText(`${spacer}min(${this.childPackets.reduce(function(acc, pack, index) {
							if(index === 0) {
								return acc + pack.value;
							} else {
								return acc + `, ${pack.value}`;
							}
						}, "")})`);
						this.value = Math.min(...(this.childPackets.map(e => e.value)));
						break;
					case "011":
						displayText(`${spacer}max(${this.childPackets.reduce(function(acc, pack, index) {
							if(index === 0) {
								return acc + pack.value;
							} else {
								return acc + `, ${pack.value}`;
							}
						}, "")})`);
						this.value = Math.max(...(this.childPackets.map(e => e.value)));
						break;
					case "101":
						displayText(`${spacer}${this.childPackets[0].value} > ${this.childPackets[1].value}`);
						this.value = +(this.childPackets[0].value > this.childPackets[1].value);
						break;
					case "110":
						displayText(`${spacer}${this.childPackets[0].value} < ${this.childPackets[1].value}`);
						this.value = +(this.childPackets[0].value < this.childPackets[1].value);
						break;
					case "111":
						displayText(`${spacer}${this.childPackets[0].value} === ${this.childPackets[1].value}`);
						this.value = +(this.childPackets[0].value === this.childPackets[1].value);
						break;
					default:
						throw `Invalid type.`;
				}
				spacer = spacer.slice(2);
				displayText(`${spacer}Value: ${this.value}`);
			}
		}
	}

	packets.push(new Packet());
	packets[0].evaluate();
	let verTotal = packets.reduce(function (acc, packet) {
		return acc + parseInt(packet.ver, 2);
	}, 0);
	displayText(`Version total: ${verTotal}`);

	updateCaption(`The packet tree is shown.`);
	updateCaption(`This shows the packet type, subpackets, and values.`);
	updateCaption(`The answers are shown as well.`);
	updateCaption(`Version total: ${verTotal}`);
	updateCaption(`Final value: ${packets[0].value}`);

}