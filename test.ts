import {
	ChessGame,
	AI,
	ChessTimer,
	Utils,
} from 'https://deno.land/x/chess_typescript@v0.1.0/mod.ts';

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
