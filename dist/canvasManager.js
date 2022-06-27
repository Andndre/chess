var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CanvasManager_scale, _CanvasManager_canvas, _CanvasManager_context;
import { log } from "./utils.js";
/**
 * This class fixes blurry problems on some devices that have a pixel ratio greater than 1.
 *
 * How it works:
 *  - Scale up the canvas resolution by the device pixel ratio (canvas size times device pixel ratio).
 *  - Then scale it down using CSS properties (width and height).
 */
export class CanvasManager {
    constructor(canvas) {
        _CanvasManager_scale.set(this, void 0);
        _CanvasManager_canvas.set(this, void 0);
        _CanvasManager_context.set(this, void 0);
        log(1, "creating CanvasManager");
        __classPrivateFieldSet(this, _CanvasManager_canvas, canvas, "f");
        __classPrivateFieldSet(this, _CanvasManager_scale, window.devicePixelRatio, "f");
        __classPrivateFieldSet(this, _CanvasManager_context, canvas.getContext("2d"), "f");
        log(-1, "");
    }
    getScale() {
        return __classPrivateFieldGet(this, _CanvasManager_scale, "f");
    }
    getCanvas() {
        return __classPrivateFieldGet(this, _CanvasManager_canvas, "f");
    }
    getContext() {
        return __classPrivateFieldGet(this, _CanvasManager_context, "f");
    }
    /**
     * Set the width of the canvas to the given width
     */
    setWidth(width) {
        log(1, "setting width ", width);
        __classPrivateFieldGet(this, _CanvasManager_canvas, "f").width = width * __classPrivateFieldGet(this, _CanvasManager_scale, "f");
        __classPrivateFieldGet(this, _CanvasManager_canvas, "f").style.width = `${width}px`;
        log(-1, "");
    }
    /**
     * Set the height of the canvas to the given height
     */
    setHeight(height) {
        log(1, "setting height ", height);
        __classPrivateFieldGet(this, _CanvasManager_canvas, "f").height = height * __classPrivateFieldGet(this, _CanvasManager_scale, "f");
        __classPrivateFieldGet(this, _CanvasManager_canvas, "f").style.height = `${height}px`;
        log(-1, "");
    }
}
_CanvasManager_scale = new WeakMap(), _CanvasManager_canvas = new WeakMap(), _CanvasManager_context = new WeakMap();
