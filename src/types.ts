import { Color, Type } from "./piece.js";

export type Size = {
	width: number;
	height: number;
};

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

export type CellStatus = "enemy" | "none" | "friend";

export type Vector = {
	x: number;
	y: number;
};
