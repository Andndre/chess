# Chess-Typescript

A minimal Chess Engine fully written in Typescript.

This library includes:
- All moves in chess
- Move validation
- FEN support
- The board is a single-dimensional array.
- Move history
- Fifty-Move rule (Can be turned off)
- Super basic AI

### **Usage**:
- **DENO**
```ts
import { ... } from 'https://deno.land/x/chess_typescript/mod.ts'
```
- **NODE**
```
npm i chess_typescript
```
```ts
import { ... } from 'chess_typescript'
```

Example: **Easy AI vs Monkey AI**
```ts
// import ....

const main = async () => {
	const chessGame = ChessGame.newStandardGame();
	const easyAI = new AI.EasyAI(chessGame);
	const monkeyAI = new AI.MonkeyAI(chessGame);

	chessGame.onBlackPromote = () => {
		const lastMove = chessGame.mover.getLastMove();
		// pieceType | color
		chessGame.board.tiles[lastMove.to.index].code =
			Utils.randomFromArray([Type.bishop, Type.queen, Type.knight, Type.rook]) |
			lastMove.from.color;
		// if we didn't set the piece type on promote, the piece will turn into a queen
	};


	console.log(chessGame.board.toString());
	/**
		♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜ 
		♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟ 




		♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙ 
		♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖ 
	 */

	let mv = 0;

	while (!chessGame.gameOver) {
		console.clear();
		// easyAI as white, and monkeyAI as black
		const move = mv++ % 2 == 0 ? easyAI.getMove() : monkeyAI.getMove();
		if (move) {
			chessGame.mover.moveStrict(move.from, move.to);
			// NEEDED
			chessGame.mover.next();
		}
		console.log(move);
		console.log(chessGame.board.toString());
		await Utils.sleep(500);
	}

	console.log(chessGame.gameOverReason + '!');
};

main().catch((err) => console.error(err));
```