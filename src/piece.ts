class Piece{
  static none = 0;
  static king = 1;
  static queen = 2;
  static knight = 3;
  static bishop = 4;
  static pawn = 5;
  static rook = 6;

  // for example in binary, 10001. the first two bit represents the colour and the rest represents the type
  static white = 16;
  static black = 8;

  static isColor(piece: number, color: number){
    return Piece.getColor(piece) == color;
  }

  static getType(piece: number){
    return piece & 7;
  }

  static getColor(piece: number){
    return piece & 24;
  }

  static invertColor(color: number){
    return color == 16 ? 8 : 16;
  }
}
