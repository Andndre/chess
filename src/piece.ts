export enum Type {
	none = 0b00000, // ...0
	king = 0b00001, // ...1
	queen = 0b00010, // ...10
	knight = 0b00011, // ...11
	bishop = 0b00100, // ...100
	pawn = 0b00101, // ...101
	rook = 0b00110, // ...110
}

export enum Color {
	white = 0b10000,
	black = 0b01000,
	none = 0b00000,
}

/* 
EXAMPLE:
white king => 16 | 1 = 0b10000 | 0b00001 = 0b10001 = 17
*/

export class Piece {
	index: number;
	code: number;
	moved = 0;

	constructor(index: number, code: number) {
		this.index = index;
		this.code = code;
	}

	/**
	 * "Returns true if the piece is the same color as the color passed in."
	 *
	 * @param {number} piece - The piece to check.
	 * @param {number} color - 16 for white, 8 for black
	 * @returns A boolean value.
	 */
	static isColor(piece: number, color: Color) {
		// test
		return Piece.getColor(piece) == color;
	}

	/**
	 * This function returns true if the piece is the color passed in, otherwise it returns false.
	 * @param {Color} color - 16 for white, 8 for black
	 * @returns A boolean value.
	 */
	isColor(color: Color) {
		return Piece.isColor(this.code, color);
	}

	static isType(piece: number, type: Type) {
		return Piece.getType(piece) == type;
	}

	isType(type: Type) {
		return Piece.isType(this.code, type);
	}

	/**
	 * It returns the type of the piece.
	 * @param piece - The piece to get the type of.
	 * @returns The piece type.
	 */
	static getType(piece: number) {
		return piece & 0b00111;
	}

	/**
	 * It returns the type of the data.
	 * @returns The data property is being returned.
	 */
	getType() {
		return this.code & 0b00111;
	}

	/**
	 * It returns the color of the piece.
	 * @param {number} code - The piece to get the color of.
	 * @returns The color of the piece.
	 */
	static getColor(code: number) {
		return code & 0b11000;
	}

	/**
	 * It returns the color of the piece.
	 * @returns The color of the piece.
	 */
	getColor(): Color {
		return this.code & 0b11000;
	}

	/**
	 * If the color is 16 (white), return 8 (black), otherwise return 16 (white).
	 * @param {Color} color - The color of the text.
	 * @returns The color is being returned.
	 */
	static invertColor(color: Color) {
		return color == Color.white ? Color.black : Color.white;
	}

	/**
	 * It returns the piece type from the char.
	 * @param {string} char - The character that represents the piece type.
	 * @returns The type of piece.
	 */
	static getTypeFromChar(char: string) {
		switch (char.toLowerCase()) {
			case 'p':
				return Type.pawn;
			case 'b':
				return Type.bishop;
			case 'k':
				return Type.king;
			case 'q':
				return Type.queen;
			case 'r':
				return Type.rook;
			case 'n':
				return Type.knight;
		}
	}

	/**
	 * It returns a string that represents the piece's type and color.
	 * Upper case for white pieces and lower case for black pieces.
	 * @returns A string representation of the piece.
	 */
	toString() {
		let char = '';
		switch (this.getType()) {
			case Type.bishop:
				char = 'b';
				break;
			case Type.king:
				char = 'k';
				break;
			case Type.knight:
				char = 'n';
				break;
			case Type.pawn:
				char = 'p';
				break;
			case Type.queen:
				char = 'q';
				break;
			case Type.rook:
				char = 'r';
				break;
		}
		if (this.getColor() == Color.white) {
			return char.toUpperCase();
		}
		return char;
	}
}
