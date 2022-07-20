import { Color, Type } from './piece.ts';

export type TileInfo = {
	index: number;
	type: Type;
	color: Color;
};

export type Move = {
	from: TileInfo;
	to: TileInfo;
	capture?: TileInfo;
	move?: Move;
	check?: number;
};

export type CellStatus = 'enemy' | 'none' | 'friend';

export type Vector = {
	x: number;
	y: number;
};

export type ChessEvent =
	| 'move'
	| 'undo'
	| 'capture'
	| 'promote'
	| 'castle'
	| 'gameOver';
export type GameOverReason = 'not true' | 'checkMate' | 'draw' | 'staleMate';
export type CallBackFunction = () => void;
