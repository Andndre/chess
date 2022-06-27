import { CanvasManager } from "./canvasManager.js";
import { Color, Piece, Type } from "./piece.js";
import { log } from "./utils.js";

export class SpritesManager {
	imageSource: CanvasImageSource;
	spriteX: number;
	spriteY: number;
	/**
	 *
	 * @param {CanvasImageSource} canvasImgSource
	 * @param spriteX Sprites count on the X axis.
	 * @param spriteY Sprites count on the Y axis.
	 */
	constructor(
		canvasImgSource: CanvasImageSource,
		spriteX: number,
		spriteY: number
	) {
		log(1, "creating SpritesManager");
		this.imageSource = canvasImgSource;
		this.spriteX = spriteX;
		this.spriteY = spriteY;
		log(-1, "");
	}

	/**
	 * It takes a sprite from a sprite sheet and draws it on a canvas
	 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D - the context of the canvas
	 * @param {number} spriteXIndex - The X index of the sprite in the sprite sheet.
	 * @param {number} spriteYIndex - number,
	 * @param {number} canvasXCoords - The x coordinate of the canvas where the image will be drawn.
	 * @param {number} canvasYCoords - number,
	 * @param {number} width - number,
	 * @param {number} height - number,
	 * @param {boolean} rotate180deg - boolean - if true, the image will be rotated 180 degrees
	 */
	drawToBoard(
		canvasManager: CanvasManager,
		spriteXIndex: number,
		spriteYIndex: number,
		canvasXCoords: number,
		canvasYCoords: number,
		rotate180deg: boolean
	) {
		// log(1, "drawing piece to the board");
		const ctx = canvasManager.getContext();

		ctx.save();

		let singleSpriteSize = (this.imageSource.width as number) / this.spriteX;

		let tileSize = canvasManager.getCanvas().width / 8;

		let sign = 1;
		let div = 1;
		if (rotate180deg) {
			ctx.translate(
				tileSize * (canvasXCoords / 2 + 1),
				tileSize * (canvasYCoords / 2 + 1)
			);
			ctx.rotate(Math.PI);
			sign = -1;
			div = 2;
		}
		// draw the piece
		ctx.drawImage(
			this.imageSource,
			spriteXIndex * singleSpriteSize,
			spriteYIndex * singleSpriteSize,
			singleSpriteSize,
			singleSpriteSize,
			(canvasXCoords * tileSize * sign) / div,
			(canvasYCoords * tileSize * sign) / div,
			tileSize,
			tileSize
		);

		ctx.restore();
		// log(-1, "");
	}

	getPieceCoords(piece: Piece) {
		const y = piece.isColor(Color.black) ? 1 : 0;
		const x = [
			Type.king,
			Type.queen,
			Type.bishop,
			Type.knight,
			Type.rook,
			Type.pawn,
		].indexOf(piece.getType());
		return { x, y };
	}
}
