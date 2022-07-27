import { Board } from './board.js';
import { ChessGame } from './chessGame.js';
import { directionOffsets, DOWN, LEFT, NONE, UP } from './constants.js';
import {
	getCoords,
	getIndex,
	getIndexFromChessNotation,
} from './coordinates.js';
import { Color, Piece, Type } from './piece.js';
import { CellStatus, Move } from './types.js';
import { isUpperCase, lastElementInAnArray } from './utils.js';

type CheckIndex = {
	16: number;
	8: number;
};

export class Mover {
	board: Board;
	current: Color = Color.white;
	selectedIndex = NONE;
	history: Move[] = [];
	enpassantTarget = -1;
	checkIndex = {
		16: NONE,
		8: NONE,
	} as CheckIndex;
	/**
	 * If white is permitted to castle on the Queen's side
	 */
	Q = true;
	/**
	 * If black is permitted to castle on the Queen's side
	 */
	q = true;
	/**
	 * If white is permitted to castle on the King's side
	 */
	K = true;
	/**
	 * If black is permitted to castle on the King's side,
	 */
	k = true;
	/**
	 * All moves for each tiles
	 */
	allMoves: Move[][] = [];
	checkMate = false;
	staleMate = false;
	chessGame: ChessGame;
	constructor(board: Board, chessGame: ChessGame, fen: string) {
		this.chessGame = chessGame;
		this.board = board;
		this.loadFenString(fen);
		this.generateNextMove();
	}

	/**
	 * Alias for
	 * ```ts
	 * const lastMove = this.getLastMove();
	 * return lastMove.from.type !== this.board.tiles[lastMove.to.index].getType();
	 * ```
	 */
	isPromote() {
		const lastMove = this.getLastMove();
		return lastMove.from.type !== this.board.tiles[lastMove.to.index].getType();
	}

	/**
	 * Alias for
	 * ```ts
	 * const lastMove = this.getLastMove();
	 * const code = type | lastMove.from.color;
	 * lastMove.to.type = type;
	 * this.board.tiles[lastMove.to.index].code = code;
	 * ```
	 */
	promoteLastMoveTo(type: Type) {
		const lastMove = this.getLastMove();
		const code = type | lastMove.from.color;
		lastMove.to.type = type;
		this.board.tiles[lastMove.to.index].code = code;
	}

	/**
	 * Alias for
	 * ```ts
	 * lastElementInAnArray(this.history);
	 * ```
	 */
	getLastMove() {
		return lastElementInAnArray(this.history);
	}

	getAllIndexesThatCanMove() {
		const avIndexes: number[] = [];
		for (const tile of this.chessGame.mover.allMoves) {
			if (!tile.length) continue;
			avIndexes.push(tile[0].from.index);
		}
		return avIndexes;
	}

	/**
	 * If `this.selectedIndex === -1`, it will select a tile ONLY IF
	 * the piece in that index was the same color as the `this.current`
	 *
	 * If `this.selectedIndex !== -1` it will move the piece from
	 * `this.selectedIndex` to the input `index` ONLY IF `index`
	 * was a valid destination
	 */
	selectTile(index: number) {
		const isFriendly = this.board.tiles[index].isColor(this.current);
		if (isFriendly) {
			this.selectedIndex = index;
		} else if (
			this.selectedIndex != NONE &&
			this.allMoves[this.selectedIndex].find((move) => move.to.index == index)
		) {
			const move = this.allMoves[this.selectedIndex].find((move) => {
				return move.to.index == index;
			})!;
			this.__move__(move);

			this.checkIndex[16] = NONE;
			this.checkIndex[8] = NONE;

			const enemyColor = this.current;
			const enemyKingIndex = this.getKingIndex(enemyColor);
			const isCheck = this.isAttacked(enemyKingIndex);

			const lastMove = lastElementInAnArray(this.history);
			if (isCheck) {
				if (enemyColor !== Color.none) {
					this.checkIndex[enemyColor] = enemyKingIndex;
					lastMove.check = enemyKingIndex;
				}
			}

			if (this.chessGame.fiftyMoveRule && this.halfMoveClock() === 100) {
				this.chessGame.gameOver = true;
				this.chessGame.gameOverReason = 'draw';
				this.chessGame.onGameOver();
			}
			if (move.from.type === Type.rook) {
				if (move.from.color === Color.white) {
					if (move.from.index % 8 === 7) {
						this.K = false;
					} else {
						this.Q = false;
					}
				} else {
					if (move.from.index % 7 === 0) {
						this.k = false;
					} else {
						this.q = false;
					}
				}
			}
			if (move.from.type === Type.king) {
				if (move.from.color === Color.white) {
					this.K = false;
					this.Q = false;
				} else {
					this.k = false;
					this.q = false;
				}
			}

			this.selectedIndex = NONE;
			this.enpassantTarget = -1;

			if (
				lastMove.from.type === Type.pawn &&
				Math.abs(lastMove.to.index - lastMove.from.index) === DOWN * 2
			) {
				this.enpassantTarget = (lastMove.to.index + lastMove.from.index) / 2;
			}

			// run CallBack
			this.chessGame.onMove();
			if (lastMove.move) {
				this.chessGame.onCastle();
			}
			if (
				lastMove.from.type === Type.pawn &&
				getCoords(lastMove.to.index).y ===
					(lastMove.from.color === Color.white ? 0 : 7)
			) {
				if (lastMove.from.color === Color.white)
					this.chessGame.onWhitePromote();
				else this.chessGame.onBlackPromote();
				// if not handled yet, promote to a queen
				if (this.board.tiles[lastMove.to.index].getType() === Type.pawn) {
					this.board.tiles[lastMove.to.index].code =
						Type.queen | lastMove.from.color;
				}
			}
		} else {
			this.selectedIndex = NONE;
		}
	}

	/**
	 * alias for generateNextMove
	 */
	next() {
		this.generateNextMove();
	}

	/**
	 * **if the move is invalid, bad things might happen (or, nothing will happen)**.
	 *
	 * So make sure that the move was in `this.allMoves`
	 *
	 * Only indexes are supported
	 */
	moveStrict(from: number, to: number) {
		this.selectedIndex = -1;
		this.enpassantTarget = -1;
		this.selectTile(from);
		this.selectTile(to);
	}

	/**
	 * Check if the current king is under attack.
	 */
	isCheck() {
		const enemyKingIndex = this.getKingIndex(this.current);
		return this.isAttacked(enemyKingIndex);
	}

	/**
	 * Example of using chess notation:
	 * ```ts
	 * // Move from `b1` to `d2`
	 * moveStrictUsingChessNotation('b1d2')
	 * // Pawn promotion
	 * moveStrictUsingChessNotation('g7g8=Q')
	 * // Castling King's side
	 * moveStrictUsingChessNotation('0-0') // or 0-0-0 for queen's side
	 * ```
	 * If there is no ambiguity,
	 * you **cannot** use shorthand notation such as `e4`,
	 * or else it might will not work.
	 *
	 * Like moveStrict(), if the move is invalid, bad things might happen
	 */
	moveStrictUsingChessNotation(move: string) {
		if (move.indexOf('-') !== -1) {
			const kingIndex = this.current === Color.white ? 60 : 4;
			// king's side
			const offset = move.split('-').length - 1 === 1 ? 2 : -2;
			this.moveStrict(kingIndex, kingIndex + offset);
			return;
		}
		const from = getIndexFromChessNotation(move.substring(0, 2));
		const to = getIndexFromChessNotation(move.substring(2, 4));
		if (move.indexOf('=') !== -1) {
			this.moveStrict(from, to);
			this.board.tiles[to].code =
				Piece.getTypeFromChar(move.charAt(5))! |
				this.board.tiles[to].getColor();
		} else {
			this.moveStrict(from, to);
		}
	}

	/**
	 * Checks if the move was in `this.allMoves`
	 */
	isValid(move: Move) {
		if (!this.allMoves[move.from.index]) return false;
		return !!this.allMoves[move.from.index].find(
			(e) => e.to.index === move.to.index
		);
	}

	/**
	 * **DO NOT USE**.
	 *
	 * Use this function when creating your own AI using `BaseAI` interface just
	 * to **test** the move, then undo using `undoMove(true)`.
	 * You can see the `getMoveUsingMinMax` example [right here](https://github.com/Andndre/chess/blob/main/src/AI/utils/brain.ts)
	 * for generating a move for [this AI](https://github.com/Andndre/chess/blob/main/src/AI/easyAI.ts)
	 */
	__move__(move: Move) {
		const from = this.board.tiles[move.from.index];
		const to = this.board.tiles[move.to.index];

		from.moved++;

		if (move.capture) {
			this.board.tiles[move.capture.index].code = Type.none;
		}

		if (move.move) {
			const from_ = this.board.tiles[move.move.from.index];
			from_.moved++;
			const to_ = this.board.tiles[move.move.to.index];
			to_.code = from_.code;
			from_.code = Type.none;
		}

		to.code = from.code;
		from.code = Type.none;
		this.current = this.current == Color.white ? Color.black : Color.white;
		this.history.push(move);
	}

	/**
	 * Restore the board to the state it was in before the last move in the history was made
	 *
	 * `justAText = false` means do not run onUndo callBack
	 */
	undoMove(justATest = false) {
		const move = this.history.pop();
		if (!move) return;

		const from = this.board.tiles[move.from.index];
		const to = this.board.tiles[move.to.index];

		from.moved--;

		if (!from.moved) {
			if (from.isType(Type.king)) {
				if (from.isColor(Color.white)) {
					this.Q = true;
					this.K = true;
				} else {
					this.q = true;
					this.k = true;
				}
			}
		} else if (from.isType(Type.rook)) {
			if (from.isColor(Color.white)) {
				if (from.index % 8 === 7) {
					this.K = true;
				} else {
					this.Q = true;
				}
			} else {
				if (from.index % 7 === 0) {
					this.k = true;
				} else {
					this.q = true;
				}
			}
		}

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

		if (!justATest) {
			this.chessGame.onUndo();

			this.chessGame.gameOver = false;
			this.chessGame.gameOverReason = 'not true';
		}
	}

	/**
	 * Fills the legal moves array with the legal moves for the current player
	 */
	generateNextMove() {
		// may be redundant
		if (this.chessGame.gameOver) return;
		this.allMoves.splice(0, this.allMoves.length);
		const { moves, checkMate, staleMate } = this.__generateMoves__(
			this.current
		);
		this.checkMate = checkMate;
		this.staleMate = staleMate;
		if (checkMate) {
			this.chessGame.gameOver = true;
			this.chessGame.gameOverReason = 'checkMate';
			this.chessGame.onGameOver();
		} else if (staleMate) {
			this.chessGame.gameOver = true;
			this.chessGame.gameOverReason = 'staleMate';
			this.chessGame.onGameOver();
		}
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
		let staleMate = false;

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

		if (checkMate && !this.isAttacked(kingIndex)) {
			staleMate = true;
			checkMate = false;
		}

		return { moves, checkMate, staleMate };
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

		this.__move__(move);
		const isAttacked = this.isAttacked(kingIndex);
		this.undoMove(true);
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

	/**
	 * Convert fromIndex and toIndex (and optionally capture?: number; move?: Move;) to a Move object
	 */
	getMove(
		fromIndex: number,
		toIndex: number,
		options?: {
			capture?: number;
			move?: Move;
		}
	): Move {
		// console.clear();
		// console.log({ fromIndex, toIndex });
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
			if (this.enpassantTarget !== -1) {
				if (from + offset - 1 === this.enpassantTarget) {
					result.push(
						this.getMove(from, from + offset - 1, { capture: from - 1 })
					);
				}
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
			if (this.enpassantTarget !== -1) {
				if (from + offset + 1 === this.enpassantTarget) {
					result.push(
						this.getMove(from, from + offset + 1, { capture: from + 1 })
					);
				}
			}
		}
		return result;
	}

	/**
	 * Check if the piece on the input `index` is under attack.
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
	 * The function returns an array of possible moves for a knight
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
	 * The function returns an array of possible moves for a king
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
		// Queen's side
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

		// King's side
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

	halfMoveClock() {
		return this.history.length;
	}

	fullMoveNumber() {
		return Math.floor(this.history.length / 2) + 1;
	}

	loadFenString(fen: string) {
		const fenComponents = fen.split(' ');
		const fenPositions = fenComponents[0].split('/');
		// load FEN positions
		// loop through each row
		let index = 0;
		for (const row of fenPositions) {
			// loop through each character in the row
			for (const char of row) {
				// if the character is a number, add that many blank squares to the board
				if (char.match(/[0-9]/)) {
					const num = Number.parseInt(char);
					// fill with none
					for (let i = index; i <= index + num; i++) {
						this.board.tiles[i] = new Piece(i, Type.none);
					}
					// skip
					index += num;
					continue;
				}
				// if the character is a letter, add that piece to the board
				const piece = new Piece(index, Piece.getTypeFromChar(char)!);
				// add the piece to the board
				this.board.tiles[index] = piece;
				const white = isUpperCase(char);
				// set the piece's colour
				this.board.tiles[index].code |= white ? Color.white : Color.black;
				index++;
			}
		}
		// use default
		if (fenComponents.length < 2) return;
		const current = fenComponents[1];
		if (current === 'b') {
			this.current = Color.black;
		}
		// use default
		if (fenComponents.length < 3) return;
		const castling = fenComponents[2];
		this.K = false;
		this.k = false;
		this.Q = false;
		this.q = false;
		if (castling !== '-') {
			for (const char of castling) {
				switch (char) {
					case 'K':
						this.K = true;
						break;
					case 'k':
						this.k = true;
						break;
					case 'Q':
						this.Q = true;
						break;
					case 'q':
						this.q = true;
						break;
				}
			}
		}

		// use default
		if (fenComponents.length < 4) return;
		const enpassantTarget = fenComponents[3];
		if (enpassantTarget !== '-') {
			const x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(
				enpassantTarget.charAt(0)
			);
			const y = 8 - parseInt(enpassantTarget.charAt(1));
			const enpassantTargetIndex = getIndex(x, y);
			this.enpassantTarget = enpassantTargetIndex;
		}
	}
}
