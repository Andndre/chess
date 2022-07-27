"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimax = void 0;
const piece_js_1 = require("../../piece.js");
const utils_js_1 = require("./utils.js");
const countMaterial = (chessState) => {
    let white = 0;
    let black = 0;
    for (const tile of chessState.board.tiles) {
        if (tile.getColor() === piece_js_1.Color.white) {
            white += (0, utils_js_1.getPieceScore)(tile.getType());
        }
        else {
            black += (0, utils_js_1.getPieceScore)(tile.getType());
        }
    }
    return { white, black };
};
const evaluate = (chessState, maximizingPlayerIsWhite) => {
    const { white, black } = countMaterial(chessState);
    let evaluation = white - black;
    if (!maximizingPlayerIsWhite)
        evaluation = -evaluation;
    return 0;
};
const minimax = (chessState, depth, alpha, beta, maximizingPlayer = true) => {
    if (depth === 0 || chessState.gameOver) {
        const ev = evaluate(chessState, maximizingPlayer && chessState.mover.current === piece_js_1.Color.white);
        // console.log('score: ', ev);
        return ev;
    }
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const index of chessState.mover.getAllIndexesThatCanMove()) {
            for (const move of chessState.mover.allMoves[index]) {
                const prevAllMoves = [...chessState.mover.allMoves];
                if (chessState.gameOverReason === 'checkMate')
                    return Infinity;
                if (chessState.gameOver)
                    return 0;
                chessState.mover.moveTest(move);
                chessState.mover.next();
                const currentEval = (0, exports.minimax)(chessState, depth - 1, alpha, beta, false);
                chessState.mover.undoMove(true);
                chessState.mover.allMoves = prevAllMoves;
                maxEval = Math.max(maxEval, currentEval);
                alpha = Math.max(alpha, currentEval);
                if (beta <= alpha) {
                    // console.log('prune');
                    break;
                }
            }
        }
        return maxEval;
    }
    else {
        let minEval = Infinity;
        for (const index of chessState.mover.getAllIndexesThatCanMove()) {
            for (const move of chessState.mover.allMoves[index]) {
                const prevAllMoves = [...chessState.mover.allMoves];
                if (chessState.gameOverReason === 'checkMate')
                    return -Infinity;
                if (chessState.gameOver)
                    return 0;
                chessState.mover.moveTest(move);
                chessState.mover.next();
                const currentEval = (0, exports.minimax)(chessState, depth - 1, alpha, beta, true);
                chessState.mover.undoMove(true);
                chessState.mover.allMoves = prevAllMoves;
                minEval = Math.min(minEval, currentEval);
                beta = Math.min(beta, currentEval);
                if (beta <= alpha) {
                    // console.log('prune');
                    break;
                }
            }
        }
        return minEval;
    }
};
exports.minimax = minimax;
