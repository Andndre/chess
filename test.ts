import { ChessGame } from './mod.ts';

const chessGame = ChessGame.newStandardGame();
const mover = chessGame.mover;

console.log(chessGame.board.getFenString(mover));
