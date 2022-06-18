import { board } from "./globals.js";

export default class Piece {
	// none represents an empty square
	static none = 0; // ...0
	static king = 1; // ...1
	static queen = 2; // ...10
	static knight = 3; // ...11
	static bishop = 4; // ...100
	static pawn = 5; // ...101
	static rook = 6; // ...110

	// for example in binary, 10001. the first two bit represents the colour and the rest represents the type
	static white = 16;
	static black = 8;

	public index: number;
	public data: number;

	constructor(index: number, data: number) {
		this.index = index;
		this.data = data;
	}

	/**
	 * "Returns true if the piece is the same color as the color passed in."
	 *
	 * @param {number} piece - The piece to check.
	 * @param {number} color - 16 for white, 8 for black
	 * @returns A boolean value.
	 */
	static isColor(piece: number, color: number) {
		return Piece.getColor(piece) == color;
	}

	/**
	 * This function returns true if the piece is the color passed in, otherwise it returns false.
	 * @param {number} color - 16 for white, 8 for black
	 * @returns A boolean value.
	 */
	public isColor(color: number) {
		return Piece.isColor(this.data, color);
	}

	/**
	 * It returns the type of the piece.
	 * @param {number} piece - The piece to get the type of.
	 * @returns The piece type.
	 */
	static getType(piece: number) {
		return piece & 7;
	}

	/**
	 * It returns the type of the data.
	 * @returns The data property is being returned.
	 */
	public getType() {
		return this.data & 7;
	}

	/**
	 * It returns the color of the piece.
	 * @param {number} piece - The piece to get the color of.
	 * @returns The color of the piece.
	 */
	static getColor(piece: number) {
		return piece & 24;
	}

	/**
	 * It returns the color of the piece.
	 * @returns The color of the piece.
	 */
	public getColor() {
		return this.data & 24;
	}

	/**
	 * If the color is 16 (white), return 8 (black), otherwise return 16 (white).
	 * @param {number} color - The color of the text.
	 * @returns The color is being returned.
	 */
	static invertColor(color: number) {
		return color == 16 ? 8 : 16;
	}

	/**
	 * It returns the piece type from the char.
	 * @param {string} char - The character that represents the piece type.
	 * @returns The type of piece.
	 */
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

	static includesData(moves: number[], ...datas: number[]): boolean {
		for (let move of moves) {
			for (let data of datas) {
				if (board.square[move].data == data) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * It returns a string that represents the piece's type and color.
	 * Upper case for white pieces and lower case for black pieces.
	 * @returns A string representation of the piece.
	 */
	public getPieceChar() {
		let char = "";
		switch (this.getType()) {
			case Piece.bishop:
				char = "b";
				break;
			case Piece.king:
				char = "k";
				break;
			case Piece.knight:
				char = "n";
				break;
			case Piece.pawn:
				char = "p";
				break;
			case Piece.queen:
				char = "q";
				break;
			case Piece.rook:
				char = "r";
				break;
		}
		if (this.getColor() == Piece.white) {
			return char.toUpperCase();
		}
		return char;
	}
}
