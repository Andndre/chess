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
