import { ChessGame, ChessTimer, AI, Utils } from './mod.ts';

const chessGame = ChessGame.newStandardGame();
const mover = chessGame.mover;
new ChessTimer(5, chessGame, () => {
	console.log('Time is up!');
});
chessGame.on('gameOver', () => {
	console.log('The game is over: ' + chessGame.gameOverReason);
});
const monkeyAI = new AI.MonkeyAI(chessGame);
while (!chessGame.gameOver) {
	console.log(chessGame.board.getFenString(mover));
	monkeyAI.takeTurn();
	await Utils.sleep(2500);
}
