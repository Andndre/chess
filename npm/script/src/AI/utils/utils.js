"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoveScore = exports.getPieceScore = void 0;
const piece_js_1 = require("../../piece.js");
const getPieceScore = (type) => {
    switch (type) {
        case piece_js_1.Type.pawn:
            return 10;
        case piece_js_1.Type.knight:
            return 30;
        case piece_js_1.Type.bishop:
            return 30;
        case piece_js_1.Type.rook:
            return 50;
        case piece_js_1.Type.queen:
            return 90;
        case piece_js_1.Type.king:
            return 900;
        default:
            return 0;
    }
};
exports.getPieceScore = getPieceScore;
const getMoveScore = (move) => {
    return (0, exports.getPieceScore)(move.to.type);
};
exports.getMoveScore = getMoveScore;
