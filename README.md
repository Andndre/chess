# Chess-Typescript

A minimal Chess Engine fully written in Typescript.

This library includes:
- All moves in chess
- Move validation
- FEN support
- The board is a single-dimensional array.
- Move history
- Fifty-Move rule (Can be turned off)
- Timer
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

Example: **Random Move**
```ts
// import ....

const main = async () => {
	const chessGame = ChessGame.newStandardGame();
	const mover = chessGame.mover;
	new ChessTimer(60 * 3, chessGame, () => {
		console.log('Time is up!');
	});
	chessGame.on('gameOver', () => {
		console.log('The game is over: ' + chessGame.gameOverReason);
	});
	const monkeyAI = new AI.MonkeyAI(chessGame);
	while (!chessGame.gameOver) {
		console.log(chessGame.board.getFenString(mover));
		monkeyAI.takeTurn();
		// await Utils.sleep(Math.random() * 3000 + 3000);
		await Utils.sleep(Math.random() * 500);
	}

	console.log('FINAL FEN');
	console.log(chessGame.board.getFenString(mover));
};

main().catch((err) => console.error(err));

```