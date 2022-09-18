function PrSq(sq) {
  return FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]];
}

function PrMove(move) {
  var MvStr;

  var ff = FilesBrd[FROMSQ(move)];
  var rf = RanksBrd[FROMSQ(move)];
  var ft = FilesBrd[TOSQ(move)];
  var rt = RanksBrd[TOSQ(move)];

  MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];

  var promoted = PROMOTED(move);
  console.log("promoted = " + promoted);
  if (promoted != PIECES.EMPTY) {
    var pchar = "q";
    if (PieceKnight[promoted] == BOOL.TRUE) {
      pchar = "n";
    } else if (
      PieceRookQueen[promoted] == BOOL.TRUE &&
      PieceBishopQueen[promoted] == BOOL.FALSE
    ) {
      pchar = "r";
    } else if (
      PieceRookQueen[promoted] == BOOL.FALSE &&
      PieceBishopQueen[promoted] == BOOL.TRUE
    ) {
      pchar = "b";
    }
    MvStr += pchar;
  }
  return MvStr;
}

function PrintMoveList() {
  var index;
  var move;
  var num = 1;
  console.log("MoveList:");

  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    move = GameBoard.moveList[index];
    console.log("Move:" + num + ":" + PrMove(move));
    num++;
  }
}
