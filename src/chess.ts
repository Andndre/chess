type CellPieceInfo = 'enemy' | 'none' | 'friend';

class Chess{
  public board: number[];
  public currentPlayer: number;
  public selectedIndex?: number;
  public firstPlayer: number;
  public check?: number;
  public availableMoves: number[];
  constructor(fenString: string){
    this.board = [];
    this.availableMoves = [];
    this.firstPlayer = isLowerCase (fenString[0]) ? Piece.white : Piece.black;
    this.currentPlayer = this.firstPlayer;
    applyFen (this.board, fenString);
  }

  move (from: number, to: number) {
    let prevCheck = this.check;
    let tmp = this.board [to];
    this.board [to] = this.board [from];
    this.board [from] = Piece.none;
    this.check = undefined;
    this.generateAvailableMoves (this.board [to], to);
    this.currentPlayer = Piece.invertColor (this.currentPlayer);
    for (let i = 0; i < 64; i++) {
      if (this.isFriend (i)) {
        this.generateAvailableMoves (this.board [i], i);
      }
    }
    if (this.check != undefined && prevCheck != undefined) {
      this.board [from] = this.board [to];
      this.board [to] = tmp;
      this.check = prevCheck;
      this.currentPlayer = Piece.invertColor (this.currentPlayer);
    }
  }

  clicked(index: number): boolean {
    if(this.selectedIndex == index) return false;
    // select
    if(this.board[index] 
      && this.isFriend (index)){
        this.selectedIndex = index;
      this.availableMoves = this.generateAvailableMoves (this.board[index]!, index);
    }
    if(this.availableMoves.indexOf (index) != -1){
      this.move (this.selectedIndex!, index);
      this.selectedIndex = undefined;
      this.availableMoves = [];
    }
    return true;
  }
  insertAvMove (index: number, result: number[]) : CellPieceInfo{
    let res = this.checkAvMoves (index);
    if(res != 'friend') result.push (index);
    return res;
  }
  generateAvailableMoves(piece: number, index: number): number[]{
    let result: number[] = [];
    let [x, y] = getCoords (index);
    // RNBQKBNR
    // ROOKS //
    if (Piece.getType (piece) === Piece.rook){
      this.alignAxisMove (index, result);
    }
    // KNIGHTS //
    else if (Piece.getType (piece) == Piece.knight){
      let range = [[-2, 2], [-1, 1]];
      for (let i = 0; i < 2; i ++){
        for (let xOffset of range [i]){
          for (let yOffset of range [1 - i]){
            if (
              x + xOffset < 0 
              || x + xOffset > 7 
              || y + yOffset < 0 
              || y + yOffset > 7) continue;
            let index = getIndex (x + xOffset, y + yOffset);
            let status = this.insertAvMove (
              index, result
            );
            if (status == 'enemy' && Piece.getType (this.board [index]) == Piece.king) {
              this.check = index;
            }
          }
        }
      }
    }
    // BISHOPS //
    else if (Piece.getType (piece) == Piece.bishop){
      this.diagonalAxisMove(index, result);
    }
    // QUEEN //
    else if (Piece.getType (piece) == Piece.queen){
      this.alignAxisMove (index, result);
      this.diagonalAxisMove (index, result);
    }
    // KING //
    else if (Piece.getType(piece) == Piece.king){
      if(x != 0) this.insertAvMove(index-1, result);
      if(x != 7) this.insertAvMove(index+1, result);
      if(y != 0) this.insertAvMove(index-8, result);
      if(y != 7) this.insertAvMove(index+8, result);
      if(y != 7 && x != 7) this.insertAvMove(index+9, result);
      if(y != 0 && x != 7) this.insertAvMove(index-7, result);
      if(y != 7 && x != 0) this.insertAvMove(index+7, result);
      if(y != 0 && x != 0) this.insertAvMove(index-9, result);
    }
    // PAWNS //
    else if (Piece.getType(piece) == Piece.pawn){
      if(this.currentPlayer === this.firstPlayer){
        if(y == 6){
          if(this.checkAvMoves(index - 16) === 'none' && this.checkAvMoves(index - 8) === 'none'){
            result.push(index-16);
          }
        }
        if (y != 0){
          if(this.checkAvMoves(index - 8) === 'none'){
            result.push(index-8);
          }
          if (x != 0){
            if(this.checkAvMoves(index - 7) === 'enemy'){
              if (Piece.getType (this.board [index - 7]) == Piece.king) this.check = index - 7;
              result.push(index - 7);
            }
          }
          if (x != 7){
            if(this.checkAvMoves(index - 9) === 'enemy'){
              if (Piece.getType (this.board [index - 9]) == Piece.king) this.check = index - 9;
              result.push(index - 9);
            }
          }
        }
      } else {
        if (y == 1){
          if(this.checkAvMoves(index + 16) === 'none' && this.checkAvMoves(index + 8) === 'none'){
            result.push(index+16);
          }
        }
        if (y != 7){
          if(this.checkAvMoves(index + 8) === 'none'){
            result.push(index+8);
          }
          if (x != 0){
            if(this.checkAvMoves(index + 7) === 'enemy'){
              if (Piece.getType (this.board [index + 7]) == Piece.king) this.check = index + 7;
              result.push(index + 7);
            }
          }
          if (x != 7){
            if(this.checkAvMoves(index + 9) === 'enemy'){
              if (Piece.getType (this.board [index + 9]) == Piece.king) this.check = index + 9;
              result.push(index + 9);
            }
          }
        }
      }
    }

    return result;
  }
  checkAvMoves (index: number): CellPieceInfo{
    if(!this.board[index]){
      return 'none';
    }
    // friend
    if(this.isFriend(index)) return 'friend';
    // enemy
    return 'enemy';
  }

  isEnemy(index: number): boolean{
    if(this.board[index] == Piece.none) return false;
    return !Piece.isColor(this.board[index], this.currentPlayer);
  }

  isFriend(index: number): boolean{
    if(this.board[index] == Piece.none) return false;
    return Piece.isColor(this.board[index], this.currentPlayer);
  }
  
  alignAxisMove(index: number, result: number[]){
    let [, y] = getCoords (index);
    // up
    for (let i = index - 8; i >= 0; i -= 8) {
      let status = this.insertAvMove (i, result);
      if (status != 'none') { 
        if (status == 'enemy' && Piece.getType (this.board [i]) == Piece.king) {
          this.check = i;
        }
        break;
      }
    }
    // down
    for(let i = index + 8; i < 64; i += 8) {
      let status = this.insertAvMove (i, result);
      if (status != 'none') { 
        if (status == 'enemy' && Piece.getType (this.board [i]) == Piece.king) {
          this.check = i;
        }
        break;
      }
    }
    // right
    for(let i = moduloNZ (index + 1, 8); i < 8; i++) {
      let idx = y * 8 + i;
      let status = this.insertAvMove (idx, result);
      if (status != 'none') { 
        if (status == 'enemy' && Piece.getType (this.board [idx]) == Piece.king) {
          this.check = idx;
        }
        break;
      }
    }
    // left
    for(let i = moduloNZ (index + 1, 8); i > 1; i--) {
      let idx = y * 8 + i - 2;
      let status = this.insertAvMove (idx, result);
      if (status != 'none') { 
        if (status == 'enemy' && Piece.getType (this.board [idx]) == Piece.king) {
          this.check = idx;
        }
        break;
      }
    }
  }

  diagonalAxisMove (index: number, result: number[]) {
    for (let offset of diagonalAxisMoveOffsets) {
      let offsetCoord = getOffsetCoord (offset);
      let curr = getCoords (index);
      addCoord (curr, offsetCoord);
      while (curr[0] <= 7 && curr[0] >= 0 && curr[1] >= 0 && curr[1] <= 7) {
        let idx = getIndex (curr[0], curr[1]);
        let status = this.insertAvMove (idx, result);
        if (status != 'none') {
          console.log (status, Piece.getType (this.board [idx]));
          if (status == 'enemy' && Piece.getType (this.board [idx]) == Piece.king) {
            this.check = idx;
          }
          break;
        }
        addCoord (curr, offsetCoord);
      }
    }
  }
}
