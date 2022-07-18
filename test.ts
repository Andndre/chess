import { ChessGame, ChessTimer, AI, Utils } from './mod.ts';

const chessGame = ChessGame.newStandardGame();
const mover = chessGame.mover;
new ChessTimer(60 * 60, chessGame);
chessGame.on('gameOver', () => {
	console.log('The game is over: ' + chessGame.gameOverReason);
});
const monkeyAI = new AI.MonkeyAI(chessGame);
while (!chessGame.gameOver) {
	console.log(chessGame.board.getFenString(mover));
	monkeyAI.takeTurn();
	await Utils.sleep(10);
}
