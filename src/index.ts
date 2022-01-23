let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let chess = new Chess('rnbqkbnr/pp1ppppp/3R4/2p5/4P3/1P6/1PPP1PPP/RNBQKBNR');
let chessCanvas = new ChessCanvas(chess, canvas);

canvas.addEventListener('click', (e) => {
  if(chess.clicked(ChessCanvas.getCLickedIndex({x: e.clientX, y: e.clientY}))){
    chessCanvas.draw();
  };
})
