"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI = exports.Utils = exports.Board = exports.Mover = exports.TileColors = exports.ChessGame = void 0;
var chessGame_js_1 = require("./src/chessGame.js");
Object.defineProperty(exports, "ChessGame", { enumerable: true, get: function () { return chessGame_js_1.ChessGame; } });
exports.TileColors = __importStar(require("./src/colors.js"));
var mover_js_1 = require("./src/mover.js");
Object.defineProperty(exports, "Mover", { enumerable: true, get: function () { return mover_js_1.Mover; } });
__exportStar(require("./src/piece.js"), exports);
var board_js_1 = require("./src/board.js");
Object.defineProperty(exports, "Board", { enumerable: true, get: function () { return board_js_1.Board; } });
exports.Utils = __importStar(require("./src/utils.js"));
__exportStar(require("./src/types.js"), exports);
exports.AI = __importStar(require("./src/AI/AI.js"));
__exportStar(require("./src/coordinates.js"), exports);
