type CellPieceInfo = 'enemy' | 'none' | 'friend';

class Move {
  public from: number;
  public to: number;

  constructor(from: number, to: number) {
    this.from = from;
    this.to = to;
  }

  static includesTo (moves: Move[], to: number) : boolean { 
    for (let i = 0; i < moves.length; i++) {
      if (moves [i].to == to) {
        return true;
      }
    }
    return false;
  }

  static includes (moves: Move[], move: Move) : boolean { 
    for (let i = 0; i < moves.length; i++) {
      if (moves [i].from == move.from && moves [i].to == move.to) {
        return true;
      }
    }
    return false;
  }

  static checkAvMoves (to: number): CellPieceInfo{
    if(!chess.board[to]){
      return 'none';
    }
    // friend
    if(chess.isFriend(to)) return 'friend';
    // enemy
    return 'enemy';
  }

  static generateAvailableMoves(piece: number, from: number): Move[]{
    let result: Move[] = [];
    let [x, y] = getCoords (from);
    // RNBQKBNR
    // ROOKS //
    if (Piece.getType (piece) === Piece.rook){
      Move.alignAxisMove (from, result);
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
              new Move (index, index), result
            );
            if (status == 'enemy' && Piece.getType (chess.board [index]) == Piece.king) {
              chess.check = index;
            }
          }
        }
      }
    }
    // BISHOPS //
    else if (Piece.getType (piece) == Piece.bishop){
      Move.diagonalAxisMove(from, result);
    }
    // QUEEN //
    else if (Piece.getType (piece) == Piece.queen){
      Move.alignAxisMove (from, result);
      Move.diagonalAxisMove (from, result);
    }
    // KING //
    else if (Piece.getType(piece) == Piece.king){
      if(x != 0) this.insertAvMove(new Move (from, from-1), result);
      if(x != 7) this.insertAvMove(new Move (from, from+1), result);
      if(y != 0) this.insertAvMove(new Move (from, from-8), result);
      if(y != 7) this.insertAvMove(new Move (from, from+8), result);
      if(y != 7 && x != 7) this.insertAvMove(new Move (from, from+9), result);
      if(y != 0 && x != 7) this.insertAvMove(new Move (from, from-7), result);
      if(y != 7 && x != 0) this.insertAvMove(new Move (from, from+7), result);
      if(y != 0 && x != 0) this.insertAvMove(new Move (from, from-9), result);
    }
    // PAWNS //
    else if (Piece.getType(piece) == Piece.pawn){
      if(chess.currentPlayer == chess.firstPlayer){
        if(y == 6){
          if(Move.checkAvMoves(from - 16) == 'none' && Move.checkAvMoves(from - 8) == 'none'){
            result.push(new Move( from, from - 16));
          }
        }
        if (y != 0){
          if(Move.checkAvMoves(from - 8) == 'none'){
            result.push(new Move( from, from - 8));
          }
          if (x != 0){
            if(Move.checkAvMoves(from - 7) == 'enemy'){
              if (Piece.getType (chess.board [from - 7]) == Piece.king) chess.check = from - 7;
              result.push(new Move( from, from - 7));
            }
          }
          if (x != 7){
            if(Move.checkAvMoves(from - 9) == 'enemy'){
              if (Piece.getType (chess.board [from - 9]) == Piece.king) chess.check = from - 9;
              result.push(new Move (from, from - 9));
            }
          }
        }
      } else {
        if (y == 1){
          if(Move.checkAvMoves(from + 16) == 'none' && Move.checkAvMoves(from + 8) == 'none'){
            result.push(new Move (from, from + 16));
          }
        }
        if (y != 7){
          if(Move.checkAvMoves (from + 8) == 'none'){
            result.push (new Move (from, from + 8));
          }
          if (x != 0){
            if (Move.checkAvMoves (from + 7) == 'enemy'){
              if (Piece.getType (chess.board [from + 7]) == Piece.king) chess.check = from + 7;
              result.push (new Move (from, from + 7));
            }
          }
          if (x != 7){
            if(Move.checkAvMoves(from + 9) == 'enemy'){
              if (Piece.getType (chess.board [from + 9]) == Piece.king) chess.check = from + 9;
              result.push(new Move (from, from + 9));
            }
          }
        }
      }
    }

    return result;
  }

  static alignAxisMove(index: number, result: Move[]){
    let [, y] = getCoords (index);
    // up
    for (let i = index - 8; i >= 0; i -= 8) {
      let status = Move.insertAvMove (new Move (index, i), result);
      if (status != 'none') { break; }
    }
    // down
    for(let i = index + 8; i < 64; i += 8) {
      let status = this.insertAvMove (new Move (index, i), result);
      if (status != 'none') { break; }
    }
    // right
    for(let i = moduloNZ (index + 1, 8); i < 8; i++) {
      let idx = y * 8 + i;
      let status = this.insertAvMove (new Move (index, idx), result);
      if (status != 'none') { break; }
    }
    // left
    for(let i = moduloNZ (index + 1, 8); i > 1; i--) {
      let idx = y * 8 + i - 2;
      let status = this.insertAvMove (new Move (index, idx), result);
      if (status != 'none') { 
        if (status == 'enemy' && Piece.getType (chess.board [idx]) == Piece.king) { break; }
      }
    }
  }

  withTo(to: number): Move {
    return new Move(this.from, to);
  }

  static diagonalAxisMove (from: number, result: Move[]) {
    for (let offset of diagonalAxisMoveOffsets) {
      let offsetCoord = getOffsetCoord (offset);
      let curr = getCoords (from);
      addCoord (curr, offsetCoord);
      while (curr[0] <= 7 && curr[0] >= 0 && curr[1] >= 0 && curr[1] <= 7) {
        let to = getIndex (curr[0], curr[1]);
        let status = this.insertAvMove (new Move (from, to), result);
        if (status != 'none') break;
        addCoord (curr, offsetCoord);
      }
    }
  }

  static insertAvMove (index: Move, result: Move[]) : CellPieceInfo{
    let res = this.checkAvMoves (index.to);
    if(res != 'friend') result.push (index);
    return res;
  }

  static includesEnemyKing (moves: Move[], board: number[], kingsPos: number[], enemyColor: number) : number | undefined {
    for (let i = 0; i < moves.length; i++) {
      if (kingsPos.indexOf (moves [i].to) != -1) {
        if (Piece.getColor (board [moves [i].to]) == enemyColor) {
          console.log ('found enemy king at ' + moves [i].to);
          return moves [i].to;
        }
      }
    }
    console.log ('no enemy king');
    return undefined;
  }
}
