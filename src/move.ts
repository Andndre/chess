import { Board } from '../mod.ts';
import { Type } from './piece.ts';
import { TileInfo } from './types.ts';

export class Move {
	from: TileInfo;
	to: TileInfo;
	capture?: TileInfo;
	promoteTo?: Type;
	move?: Move;
	check?: number;
	constructor(
		board: Board,
		fromIndex: number,
		toIndex: number,
		captureIndex?: number,
		promoteTo?: Type,
		move?: { fromIndex: number; toIndex: number },
		checkIndex?: number
	) {
		const t = board.tiles;
		this.from = {
			color: t[fromIndex].getColor(),
			type: t[fromIndex].getType(),
			index: fromIndex,
		};
		if (promoteTo) {
			this.promoteTo = promoteTo;
		}
		this.to = {
			color: t[toIndex].getColor(),
			type: t[toIndex].getType(),
			index: toIndex,
		};
		if (captureIndex) {
			const c = t[captureIndex];
			this.capture = {
				color: c.getColor(),
				type: c.getType(),
				index: captureIndex,
			};
		}
		if (move) {
			this.move = new Move(board, move.fromIndex, move.toIndex);
		}
		if (checkIndex) {
			this.check = checkIndex;
		}
	}
}
