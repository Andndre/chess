"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoveUsingMinMax = void 0;
const utils_js_1 = require("./utils.js");
const getMoveUsingMinMax = (chessGame) => {
    const result = { from: -1, to: -1 };
    let highScore = -Infinity;
    let maxOfMin = -Infinity;
    const mover = chessGame.mover;
    for (const avIndex of mover.getAllIndexesThatCanMove()) {
        for (const move of chessGame.mover.allMoves[avIndex]) {
            const max = (0, utils_js_1.getMoveScore)(move);
            if (max < maxOfMin)
                continue;
            const prevAvMoves = [...chessGame.mover.allMoves];
            chessGame.mover.move(move);
            chessGame.mover.next();
            for (const avIndexEnemy of mover.getAllIndexesThatCanMove()) {
                for (const moveEnemy of chessGame.mover.allMoves[avIndexEnemy]) {
                    const min = (0, utils_js_1.getMoveScore)(moveEnemy);
                    if (min > maxOfMin) {
                        maxOfMin = min;
                    }
                    const current = max - min;
                    if (current > highScore) {
                        highScore = current;
                        result.from = move.from.index;
                        result.to = move.to.index;
                    }
                }
            }
            chessGame.mover.undoMove(true);
            chessGame.mover.allMoves = prevAvMoves;
        }
    }
    return { result, highScore };
};
exports.getMoveUsingMinMax = getMoveUsingMinMax;
