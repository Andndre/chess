"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directionOffsets = exports.UPLEFT = exports.DOWNRIGHT = exports.UPRIGHT = exports.DOWNLEFT = exports.RIGHT = exports.LEFT = exports.UP = exports.DOWN = exports.NONE = void 0;
exports.NONE = -1;
exports.DOWN = 8;
exports.UP = -8;
exports.LEFT = -1;
exports.RIGHT = 1;
exports.DOWNLEFT = exports.DOWN + exports.LEFT;
exports.UPRIGHT = exports.UP + exports.RIGHT;
exports.DOWNRIGHT = exports.DOWN + exports.RIGHT;
exports.UPLEFT = exports.UP + exports.LEFT;
exports.directionOffsets = [
    exports.DOWN,
    exports.UP,
    exports.LEFT,
    exports.RIGHT,
    exports.DOWNLEFT,
    exports.UPRIGHT,
    exports.DOWNRIGHT,
    exports.UPLEFT,
];
