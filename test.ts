import { ChessGame } from './mod.ts';

const chessGame = ChessGame.newStandardGame();
const mover = chessGame.mover.allMoves;

console.log(mover);
