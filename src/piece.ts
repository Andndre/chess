class Piece {
	// none represents an empty square
	static none = 0;
	static king = 1;
	static queen = 2;
	static knight = 3;
	static bishop = 4;
	static pawn = 5;
	static rook = 6;

	// for example in binary, 10001. the first two bit represents the colour and the rest represents the type
	static white = 16;
	static black = 8;

	public index: number;
	public data: number;

	constructor(index: number, data: number) {
		this.index = index;
		this.data = data;
	}

	static isColor(piece: number, color: number) {
		return Piece.getColor(piece) == color;
	}

	public isColor(color: number) {
		return Piece.isColor(this.data, color);
	}

	static getType(piece: number) {
		return piece & 7;
	}

	public getType() {
		return this.data & 7;
	}

	static getColor(piece: number) {
		return piece & 24;
	}

	public getColor() {
		return this.data & 24;
	}

	static invertColor(color: number) {
		return color == 16 ? 8 : 16;
	}

	static getTypeFromChar(char: string) {
		switch (char.toLowerCase()) {
			case "p":
				return Piece.pawn;
			case "b":
				return Piece.bishop;
			case "k":
				return Piece.king;
			case "q":
				return Piece.queen;
			case "r":
				return Piece.rook;
			case "n":
				return Piece.knight;
		}
	}
}
