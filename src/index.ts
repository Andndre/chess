let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
let chessCanvas = new ChessCanvas(chess, canvas);

canvas.addEventListener('click', (e) => {
  if(chess.clicked(ChessCanvas.getCLickedIndex({x: e.clientX, y: e.clientY}))){
    chessCanvas.draw();
  };
});

document.getElementById('sprite')?.addEventListener('load', () => chessCanvas.draw());
