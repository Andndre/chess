function applyFen (board: number[], fen: string, kingPos: number[]) {
  let index = 0;
  for (let row of fen.split(' ')[0].split ('/')) {
    for (let char of row) {
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(char) != -1) {
        let num = Number.parseInt (char);
        arrayFillRange (board, index, index + num, Piece.none);
        index += num;
        continue;
      }
      let white = isUpperCase (char);
      switch (char.toLowerCase ()){
        case 'p':
          board [index] = Piece.pawn; break; 
        case 'b':
          board [index] = Piece.bishop; break; 
        case 'k':
          board [index] = Piece.king; kingPos.push (index); break; 
        case 'q':
          board [index] = Piece.queen; break; 
        case 'r':
          board [index] = Piece.rook; break; 
        case 'n':
          board [index] = Piece.knight; break;
      }
      board [index++] |= white ? Piece.white : Piece.black;
    }
  }
}

function getFenString (board: number[]) {
  let result = '';
  for (let i = 0; i <= 56; i++){
    let noneCounter = 0;
    let j = i;
    for (; i <= j + 7; i++){
      if (board [i] == Piece.none) {
        noneCounter++;
        continue;
      }
      if (noneCounter != 0) {
        result += noneCounter;
        noneCounter = 0;
      }
      let isWhite = Piece.isColor (board [i], Piece.white);
      let curr = ''
      switch (Piece.getType (board [i])) {
        case Piece.bishop:
          curr += 'b'; break;
        case Piece.king:
          curr += 'k'; break;
        case Piece.knight:
          curr += 'n'; break;
        case Piece.pawn:
          curr += 'p'; break;
        case Piece.queen:
          curr += 'q'; break;
        case Piece.rook:
          curr += 'r'; break;
      }
      result += isWhite ? curr.toUpperCase () : curr;
    }
    if (noneCounter != 0) result += noneCounter;
    if (--i != 63) result += '/';
  }
  return result;
}

function arrayFillRange<T> (arr: T[], start: number, end: number, value: T) {
  for(let i = start; i <= end; i++){
    arr[i] = value;
  }
}

function isUpperCase (source: string) {
  return source == source.toUpperCase ();
}

function isLowerCase (source: string){
  return source == source.toLowerCase ();
}

function getCoords (index: number){
  let sign = index > 0 ? 1 : index < 0 ? -1 : 0;
  return [ index % 8, (Math.abs(index) >> 3) * sign ];
}

function getOffsetCoord (index: number) {
  let res = getCoords(index);
  if (res[0] > 1) {
    res[0] -= 8;
    res[1] += 1;
  }
  if (res[0] < -1) {
    res[0] += 8;
    res[1] -= 1;
  }
  return res;
}

function getIndex (x: number, y: number): number {
  return x + y * 8;
}

function moduloNZ (num: number, modulus: number): number {
  let res = num % modulus;
  if(res == 0) res = modulus;
  return res;
}

function addCoord (coord1: number[], coord2: number[]): number[] {
  coord1 [0] += coord2 [0];
  coord1 [1] += coord2 [1];
  return coord1;
}
