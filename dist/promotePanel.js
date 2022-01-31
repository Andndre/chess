"use strict";
class PromotePanel {
    constructor() { }
    getPiece() {
        return this.piece;
    }
    static get() {
        if (this.instance == undefined) {
            this.instance = new PromotePanel();
        }
        return this.instance;
    }
    showPanel(pawnToPromote) {
        this.piece = pawnToPromote;
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
    }
}
