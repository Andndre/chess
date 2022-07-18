import { Board } from './board.ts';
import { directionOffsets, DOWN, NONE, UP } from './constants.ts';
import { getCoords, getIndex } from './coordinates.ts';
import { Color, Piece, Type } from './piece.ts';
import { CellStatus, Move } from './types.ts';

type CheckIndex = {
	16: number;
	8: number;
};

export class Mover {
	board: Board;
	current: Color = Color.white;
	selectedIndex = NONE;
	history: Move[] = [];
	checkIndex = {
		16: NONE,
		8: NONE,
	} as CheckIndex;
	/**
	 * All moves for each tiles
	 */
	allMoves: Move[][] = [];
	checkMate = false;
	constructor(board: Board) {
		this.board = board;
		this.generateNextMove();
	}
	selectTile(index: number) {
		const isFriendly = this.board.tiles[index].isColor(this.current);

		if (isFriendly) {
			this.selectedIndex = index;
		} else if (
			this.selectedIndex != NONE &&
			this.allMoves[this.selectedIndex].find((move) => move.to.index == index)
		) {
			this.move(
				this.allMoves[this.selectedIndex].find((move) => {
					return move.to.index == index;
				})!
			);

			this.checkIndex[16] = NONE;
			this.checkIndex[8] = NONE;

			const enemyColor = this.current;
			const enemyKingIndex = this.getKingIndex(enemyColor);
			const isCheck = this.isAttacked(enemyKingIndex);

			if (isCheck) {
				if (enemyColor !== Color.none) {
					this.checkIndex[enemyColor] = enemyKingIndex;
				}
			}

			this.selectedIndex = NONE;
			this.generateNextMove();
		} else {
			this.selectedIndex = NONE;
		}
	}

	isValid(move: Move) {
		if (!this.allMoves[move.from.index]) return false;
		return !!this.allMoves[move.from.index].find(
			(e) => e.to.index === move.to.index
		);
	}

	move(move: Move) {
		const from = this.board.tiles[move.from.index];
		const to = this.board.tiles[move.to.index];

		from.moved++;

		if (move.capture) {
			this.board.tiles[move.capture.index].code = Type.none;
		}

		if (move.move) {
			const from_ = this.board.tiles[move.move.from.index];
			const to_ = this.board.tiles[move.move.to.index];
			to_.code = from_.code;
			from_.code = Type.none;
		}

		// promote
		let promote = false;
		if (
			from.isType(Type.pawn) &&
			getCoords(move.to.index).y === (from.isColor(Color.white) ? 0 : 7)
		) {
			// TODO: dropdown menu
			// await dropdown ?
			promote = true;
			to.code = Type.queen | from.getColor();
		}

		if (!promote) to.code = from.code;
		from.code = Type.none;
		this.current = this.current == Color.white ? Color.black : Color.white;
		this.history.push(move);
	}

	/**
	 * Restore the board to the state it was in before the last move in the history was made
	 */
	undoMove() {
		const move = this.history.pop();
		if (!move) return;

		const from = this.board.tiles[move.from.index];
		const to = this.board.tiles[move.to.index];

		from.moved--;

		if (move.capture) {
			this.board.tiles[move.capture.index].code =
				move.capture.color | move.capture.type;
		}

		if (move.move) {
			const from_ = this.board.tiles[move.move.from.index];
			const to_ = this.board.tiles[move.move.to.index];
			to_.code = move.move.to.color | move.move.to.type;
			from_.code = move.move.from.color | move.move.from.type;
		}

		to.code = move.to.color | move.to.type;
		from.code = move.from.color | move.from.type;
		this.current = this.current == Color.white ? Color.black : Color.white;
	}

	/**
	 * Fills the legal moves array with the legal moves for the current player
	 */
	generateNextMove() {
		this.allMoves.splice(0, this.allMoves.length);
		const { moves, checkMate } = this.__generateMoves__(this.current);
		this.checkMate = checkMate;
		this.allMoves.push(...moves);
	}

	/**
	 * @param {Color} color - The color of the player whose moves are being generated.
	 * @returns An array of arrays of moves.
	 */
	__generateMoves__(color: Color) {
		const moves: Move[][] = [];
		const kingIndex = this.getKingIndex(color);

		let checkMate = true;

		// Generate moves
		for (let i = 0; i < 64; i++) {
			if (this.board.tiles[i].isColor(color)) {
				moves[i] = this.__getLegalMoves__(i, kingIndex);
				if (checkMate) {
					checkMate = moves[i].length === 0;
				}
				continue;
			}
			moves[i] = [];
		}

		return { moves, checkMate };
	}
	/**
	 * @param {Move} move - Move - The move to check
	 * @returns A boolean value.
	 */
	__isLegal__(move: Move, kingIndex: number) {
		if (move.to.color === move.from.color) {
			return false;
		}

		if (move.from.type === Type.king) {
			kingIndex = move.to.index;
		}

		this.move(move);
		const isAttacked = this.isAttacked(kingIndex);
		this.undoMove();
		return !isAttacked;
	}
	/**
	 * It returns all the legal moves from a given square
	 * @param {number} from - the square from which you want to get the legal moves
	 * @returns An array of moves that are legal.
	 */
	__getLegalMoves__(from: number, kingIndex: number): Move[] {
		let moves = this.__getLegalAndIllegalMoves__(from);

		moves = moves.filter((move) => {
			const isLegal = this.__isLegal__(move, kingIndex);
			return isLegal;
		});

		return moves;
	}
	/**
	 * It returns all the legal and non-legal moves for a given piece
	 * @param {number} from - the tile number of the piece you want to move
	 * @returns An array of moves.
	 */
	__getLegalAndIllegalMoves__(from: number): Move[] {
		const result: Move[] = [];
		const piece = this.board.tiles[from];
		// const white = Piece.isColor(piece.code, Color.white);
		// RNBQKBNR
		// ROOKS //

		if (piece.getType() === Type.rook) {
			result.push(...this.__alignAxisMove__(from));
		}
		// KNIGHTS //
		else if (piece.getType() == Type.knight) {
			result.push(...this.__knightMove__(from));
		}
		// BISHOPS //
		else if (piece.getType() == Type.bishop) {
			result.push(...this.__diagonalAxisMove__(from));
		}
		// QUEEN //
		else if (piece.getType() == Type.queen) {
			result.push(...this.__alignAxisMove__(from));
			result.push(...this.__diagonalAxisMove__(from));
		}
		// KING //
		else if (piece.getType() == Type.king) {
			const kingMove = this.__kingMove__(from);
			result.push(...kingMove);
		}
		// PAWNS //
		else if (piece.getType() == Type.pawn) {
			result.push(...this.__pawnMove__(from));
		}

		return result;
	}

	/**
	 * Insert to the move list if the move.to s type was included in the insertIf array
	 * @param  - move - the move to be inserted
	 * @returns - true if the move is in the {insertIf} array
	 */
	__insertIf__({
		move,
		moves,
		insertIf = ['enemy', 'none'],
	}: {
		move: Move;
		moves: Move[];
		insertIf?: CellStatus[];
	}): boolean {
		const piece = this.board.tiles[move.from.index];
		const pieceTo = this.board.tiles[move.to.index];
		const color = piece.getColor();
		const colorTo = pieceTo.getColor();
		if (Piece.invertColor(color) == colorTo) {
			if (insertIf.indexOf('enemy') != NONE) {
				moves.push(move);
				return true;
			}
			return false;
		}
		if (colorTo == Color.none) {
			if (insertIf.indexOf('none') != NONE) {
				moves.push(move);
				return true;
			}
			return false;
		}
		if (insertIf.indexOf('friend') != NONE) {
			moves.push(move);
			return true;
		}
		return false;
	}

	getMove(
		fromIndex: number,
		toIndex: number,
		options?: {
			capture?: number;
			move?: Move;
		}
	): Move {
		return {
			from: {
				index: fromIndex,
				type: this.board.tiles[fromIndex].getType(),
				color: this.board.tiles[fromIndex].getColor(),
			},
			to: {
				index: toIndex,
				type: this.board.tiles[toIndex].getType(),
				color: this.board.tiles[toIndex].getColor(),
			},
			capture: options?.capture
				? {
						index: options?.capture,
						type: this.board.tiles[options?.capture].getType(),
						color: this.board.tiles[options?.capture].getColor(),
				  }
				: undefined,
			move: options?.move ? options.move : undefined,
		};
	}

	/**
	 * The function returns an array of possible moves for a pawn
	 * @param {number} from - The index of the piece that is moving.
	 * @returns Available moves for the pawn (indexes of the squares)
	 */
	__pawnMove__(from: number): Move[] {
		const result: Move[] = [];
		/* Up if the pawn is white */
		const offset = this.board.tiles[from].getColor() == Color.white ? UP : DOWN;
		/* Final index */
		const index = from + offset;

		const { y } = getCoords(from);

		/* Insert move forward if the square is empty */
		if (
			this.__insertIf__({
				move: this.getMove(from, index),
				moves: result,
				insertIf: ['none'],
			})
		) {
			/* If the pawn never moved, it can move two squares */
			if (y === (offset == DOWN ? 1 : 6)) {
				this.__insertIf__({
					move: this.getMove(from, index + offset),
					moves: result,
					insertIf: ['none'],
				});
			}
		}

		/* Checking if the index is not on the left side of the board. */
		if (index % 8 != 0) {
			/* Pawn can capture diagonally to the left.*/
			this.__insertIf__({
				move: this.getMove(from, index - 1),
				moves: result,
				insertIf: ['enemy'],
			});

			// enpassant
			const lastMove = this.history[this.history.length - 1];
			if (
				lastMove &&
				lastMove.from.type === Type.pawn &&
				lastMove.to.index === from - 1 &&
				Math.abs(lastMove.to.index - lastMove.from.index) === DOWN * 2
			) {
				result.push(
					this.getMove(from, from + offset - 1, { capture: from - 1 })
				);
			}
		}

		/* 
        Checking if the index is not on the right side of the board. 
        Note: 0 mod 8 = 0
        */
		if ((index - 7) % 8 != 0) {
			/* Pawn can capture diagonally to the right.*/
			this.__insertIf__({
				move: this.getMove(from, index + 1),
				moves: result,
				insertIf: ['enemy'],
			});

			// enpassant
			const lastMove = this.history[this.history.length - 1];
			if (
				lastMove &&
				lastMove.from.type === Type.pawn &&
				lastMove.to.index === from + 1 &&
				Math.abs(lastMove.to.index - lastMove.from.index) === DOWN * 2
			) {
				result.push(
					this.getMove(from, from + offset + 1, { capture: from + 1 })
				);
			}
		}
		return result;
	}

	/**
	 * @param index - index of the piece
	 * @returns - true if the piece was attacked
	 */
	isAttacked(index: number): boolean {
		/* Checking if the piece type is not none. */
		if (this.board.tiles[index].getType() == 0) return false;
		/* Enemy's color */
		const color = Piece.invertColor(this.board.tiles[index].getColor());

		const moveFuncs = [
			this.__alignAxisMove__,
			this.__diagonalAxisMove__,
			this.__kingMove__,
			this.__knightMove__,
		];
		const movePieces = [
			[Type.rook | color, Type.queen | color],
			[Type.bishop | color, Type.queen | color],
			[Type.king | color],
			[Type.knight | color],
		];

		for (const idx in moveFuncs) {
			const moves = moveFuncs[idx](index, this);
			const attacked = moves.find((move) => {
				return movePieces[idx].find((code) => {
					return code == (move.to.color | move.to.type);
				});
			});
			if (attacked) {
				return true;
			}
		}

		const offset = this.board.tiles[index].isColor(Color.white) ? UP : DOWN;
		if (index + offset < 0 && index + offset >= 64) return false;
		if (index % 8 != 0) {
			const piece = this.board.tiles[index + offset - 1];
			if (piece.code === (color | Type.pawn)) {
				return true;
			}
		}
		if ((index - 7) % 8 != 0) {
			const piece = this.board.tiles[index + offset + 1];
			if (piece.code === (color | Type.pawn)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @param from - The index of the piece you want to move
	 * @returns Available moves of the knight (indexes of the squares)
	 */
	__knightMove__(from: number, obj = this): Move[] {
		const result: Move[] = [];
		const { x, y } = getCoords(from);
		const range = [
			[-2, 2],
			[-1, 1],
		];

		/* Checking all the possible moves for the knight. */
		for (let i = 0; i < 2; i++) {
			for (const xOffset of range[i]) {
				for (const yOffset of range[1 - i]) {
					if (
						x + xOffset < 0 ||
						x + xOffset > 7 ||
						y + yOffset < 0 ||
						y + yOffset > 7
					)
						continue;
					const index = getIndex(x + xOffset, y + yOffset);
					obj.__insertIf__({
						move: obj.getMove(from, index),
						moves: result,
					});
				}
			}
		}

		return result;
	}

	getKingIndex(color: Color) {
		return this.board.tiles.find(
			(piece) => piece.isColor(color) && piece.isType(Type.king)
		)!.index;
	}

	/**
	 * @param {number} from - the index of the piece you want to move
	 * @returns Available moves of the king (indexes of the squares)
	 */
	__kingMove__(from: number, obj = this): Move[] {
		const result: Move[] = [];
		const range = [
			[-1, 1],
			[-1, 0],
			[-1, -1],
			[0, -1],
			[1, -1],
			[1, 0],
			[1, 1],
			[0, 1],
		];
		const { x, y } = getCoords(from);
		for (let i = 0; i < 8; i++) {
			const xOffset = range[i][0];
			const yOffset = range[i][1];
			const xFinal = x + xOffset;
			const yFinal = y + yOffset;
			if (xFinal < 0 || xFinal > 7 || yFinal < 0 || yFinal > 7) continue;
			const index = getIndex(xFinal, yFinal);
			obj.__insertIf__({ move: obj.getMove(from, index), moves: result });
		}

		const color = obj.board.tiles[from].getColor();

		if (color == Color.none) return result;

		const kingIndex = color === Color.white ? 60 : 4;
		const currentKingIndex = obj.getKingIndex(color);

		// castle
		if (kingIndex !== from || obj.board.tiles[kingIndex].moved) return result;

		if (obj.checkIndex[color] !== NONE) return result;
		// left
		if (!obj.board.tiles[kingIndex - 4].moved) {
			let allowedToCastle = true;
			for (let i = 1; i < 4; i++) {
				if (
					!obj.__isLegal__(
						obj.getMove(kingIndex, kingIndex - i),
						currentKingIndex
					)
				) {
					allowedToCastle = false;
					break;
				}
			}
			if (allowedToCastle) {
				result.push(
					obj.getMove(kingIndex, kingIndex - 2, {
						move: obj.getMove(kingIndex - 4, kingIndex - 1),
					})
				);
			}
		}

		// right
		if (!obj.board.tiles[kingIndex + 3].moved) {
			let allowedToCastle = true;
			for (let i = 1; i < 3; i++) {
				if (
					!obj.__isLegal__(
						obj.getMove(kingIndex, kingIndex + i),
						currentKingIndex
					)
				) {
					allowedToCastle = false;
					break;
				}
			}
			if (allowedToCastle) {
				result.push(
					obj.getMove(kingIndex, kingIndex + 2, {
						move: obj.getMove(kingIndex + 3, kingIndex + 1),
					})
				);
			}
		}

		return result;
	}

	/**
	 * It returns an array of all the moves that a piece can make in a straight line
	 * @param {number} from - The index of the piece you want to move.
	 * @returns An array of moves.
	 */
	__alignAxisMove__(from: number, obj = this): Move[] {
		const piece = obj.board.tiles[from];
		const colorToMove = piece.getColor();
		const moves: Move[] = [];

		for (let i = 0; i < 4; i++) {
			let current = from;
			const dirrection = directionOffsets[i];
			for (let j = 0; j < obj.board.numToEdge[from][i]; j++) {
				current += dirrection;
				const color = obj.board.tiles[current].getColor();
				if (color == Color.none || color == Piece.invertColor(colorToMove))
					moves.push(obj.getMove(from, current));

				if (color == colorToMove || color == Piece.invertColor(colorToMove))
					break;
			}
		}
		return moves;
	}

	/**
	 * It returns an array of all the moves that a piece can make in a diagonal direction
	 * @param {number} from - the index of the piece you want to move
	 * @returns An array of moves.
	 */
	__diagonalAxisMove__(from: number, obj = this): Move[] {
		const piece = obj.board.tiles[from];
		const colorToMove = piece.getColor();
		const moves: Move[] = [];

		for (let i = 4; i < 9; i++) {
			let current = from;
			const dirrection = directionOffsets[i];
			for (let j = 0; j < obj.board.numToEdge[from][i]; j++) {
				current += dirrection;
				const color = obj.board.tiles[current].getColor();
				if (color == Color.none || color == Piece.invertColor(colorToMove)) {
					moves.push(obj.getMove(from, current));
				}
				if (color == colorToMove || color == Piece.invertColor(colorToMove)) {
					break;
				}
			}
		}
		return moves;
	}
}
