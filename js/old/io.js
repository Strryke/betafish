function PrSq(sq) {
  return FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]];
}

function OppositePrSq(move) {
  // takes in a move and returns the reverse of prsq
  // b1 > 22
  // c3 > 43
  // e2 > 35
  // e3 > 45

  const file = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
  };

  let to120 = file[move[0]] + 10 * (parseInt(move[1]) + 1);

  return to120;
}

function PrMove(move) {
  var MvStr;

  var ff = FilesBrd[fromSQ(move)];
  var rf = RanksBrd[fromSQ(move)];
  var ft = FilesBrd[toSQ(move)];
  var rt = RanksBrd[toSQ(move)];

  MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];

  var promoted = PROMOTED(move);

  if (promoted != PIECES.EMPTY) {
    var pchar = "q";
    if (PieceKnight[promoted] == true) {
      pchar = "n";
    } else if (
      PieceRookQueen[promoted] == true &&
      PieceBishopQueen[promoted] == false
    ) {
      pchar = "r";
    } else if (
      PieceRookQueen[promoted] == false &&
      PieceBishopQueen[promoted] == true
    ) {
      pchar = "b";
    }
    MvStr += pchar;
  }
  return MvStr;
}

function getMoveList() {
  GenerateMoves();
  var index;
  var move;
  var num = 1;
  moves = [];

  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    ++index
  ) {
    move = GameBoard.moveList[index];
    moves.push(PrMove(move).slice(0, 4));
    num++;
  }
  console.log(moves);
  return moves;
}
