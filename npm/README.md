<div style="display:flex; flex-direction: column; align-items: center; margin-bottom: 40px">
	<h1 style="text-align: center"> Chess-Typescript </h1>
	<div style="display:flex; gap: 10px">
		<a href="https://github.com/Andndre/chess/blob/main/LICENCE.txt"><img src="https://img.shields.io/badge/License-MIT-yellow.svg"/></a>
		<a href="https://github.com/Andndre/chess"> <img src="https://tokei.rs/b1/github/Andndre/chess"/> </a>
		<a href="https://github.com/Andndre/chess"> <img src="https://tokei.rs/b1/github/Andndre/chess?category=files"/> </a>
	</div>
</div>

A minimal Chess Engine fully written in Typescript.

- [X] All moves in chess
- [X] Move validation
- [X] FEN support
- [X] The board is a single-dimensional array (`chessGame.board.tiles`)
- [X] Move history
- [X] Fifty-Move rule (can be turned off)
- [X] Scalable
- [ ] Challenging AI

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

	// if we didn't set the piece type on promote, the piece will turn into a queen
	chessGame.onBlackPromote = () =>  chessGame.mover.promoteLastMoveTo(Utils.randomFromArray([Type.bishop, Type.queen, Type.knight, Type.rook]));

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