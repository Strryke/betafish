// prettier-ignore
{
var PawnTable = [
  0,   0,   0,   0,   0,   0,  0,   0,
  98, 134,  61,  95,  68, 126, 34, -11,
  -6,   7,  26,  31,  65,  56, 25, -20,
 -14,  13,   6,  21,  23,  12, 17, -23,
 -27,  -2,  -5,  12,  17,   6, 10, -25,
 -26,  -4,  -4, -10,   3,   3, 33, -12,
 -35,  -1, -20, -23, -15,  24, 38, -22,
   0,   0,   0,   0,   0,   0,  0,   0,
];

var KnightTable = [
  -167, -89, -34, -49,  61, -97, -15, -107,
  -73, -41,  72,  36,  23,  62,   7,  -17,
  -47,  60,  37,  65,  84, 129,  73,   44,
   -9,  17,  19,  53,  37,  69,  18,   22,
  -13,   4,  16,  13,  28,  19,  21,   -8,
  -23,  -9,  12,  10,  19,  17,  25,  -16,
  -29, -53, -12,  -3,  -1,  18, -14,  -19,
 -105, -21, -58, -33, -17, -28, -19,  -23,
];

var BishopTable = [
  -29,   4, -82, -37, -25, -42,   7,  -8,
  -26,  16, -18, -13,  30,  59,  18, -47,
  -16,  37,  43,  40,  35,  50,  37,  -2,
   -4,   5,  19,  50,  37,  37,   7,  -2,
   -6,  13,  13,  26,  34,  12,  10,   4,
    0,  15,  15,  15,  14,  27,  18,  10,
    4,  15,  16,   0,   7,  21,  33,   1,
  -33,  -3, -14, -21, -13, -12, -39, -21,
];

var RookTable = [
  -29,   4, -82, -37, -25, -42,   7,  -8,
  -26,  16, -18, -13,  30,  59,  18, -47,
  -16,  37,  43,  40,  35,  50,  37,  -2,
   -4,   5,  19,  50,  37,  37,   7,  -2,
   -6,  13,  13,  26,  34,  12,  10,   4,
    0,  15,  15,  15,  14,  27,  18,  10,
    4,  15,  16,   0,   7,  21,  33,   1,
  -33,  -3, -14, -21, -13, -12, -39, -21,
];

var QueenTable = [
  -28,   0,  29,  12,  59,  44,  43,  45,
  -24, -39,  -5,   1, -16,  57,  28,  54,
  -13, -17,   7,   8,  29,  56,  47,  57,
  -27, -27, -16, -16,  -1,  17,  -2,   1,
   -9, -26,  -9, -10,  -2,  -4,   3,  -3,
  -14,   2, -11,  -2,  -5,   2,  14,   5,
  -35,  -8,  11,   2,   8,  15,  -3,   1,
   -1, -18,  -9,  10, -15, -25, -31, -50,
]

var KingTable = [
  -65,  23,  16, -15, -56, -34,   2,  13,
  29,  -1, -20,  -7,  -8,  -4, -38, -29,
  -9,  24,   2, -16, -20,   6,  22, -22,
 -17, -20, -12, -27, -30, -25, -14, -36,
 -49,  -1, -27, -39, -46, -44, -33, -51,
 -14, -14, -22, -46, -44, -30, -15, -27,
   1,   7,  -8, -64, -43, -16,   9,   8,
 -15,  36,  12, -54,   8, -28,  24,  14,
];

var EndKingTable = [
  -50, -30, -30, -30, -30, -30, -30, -50, -30, -30, 0, 0, 0, 0, -30, -30, -30,
  -10, 20, 30, 30, 20, -10, -30, -30, -10, 30, 40, 40, 30, -10, -30, -30, -10,
  30, 40, 40, 30, -10, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -30, 0, 0,
  0, 0, -30, -30, -50, -30, -30, -30, -30, -30, -30, -50,
];
}

var table = {
  wP: PawnTable.slice().reverse(),
  bP: PawnTable,
  wN: KnightTable.slice().reverse(),
  bN: KnightTable,
  wB: BishopTable.slice().reverse(),
  bB: BishopTable,
  wR: RookTable.slice().reverse(),
  bR: RookTable,
  wQ: QueenTable.slice().reverse(),
  bQ: QueenTable,
  wK: KingTable.slice().reverse(),
  bK: KingTable,
}

const BishopPair = 40;

function EvalPosition() {
  var score =
    GameBoard.material[COLOURS.WHITE] - GameBoard.material[COLOURS.BLACK];

  var pce;
  var sq;
  var pceNum;

  for (pce in PIECES) {
    // console.log(GameBoard.pceNum)
    // console.log(pce)
    // pce = PIECES[pce];
    for (pceNum = 0; pceNum < GameBoard.pceNum[PIECES[pce]]; pceNum++) {
      // console.log("a")
      sq = GameBoard.pList[getPieceIndex(PIECES[pce], pceNum)];
      // score += PawnTable[SQ64(sq)];
      if (pce[0] == "w") {
        score += table[pce][sq120to64(sq)];
      } else {
        score -= table[pce][(mirror64(sq120to64(sq)))];
      }
    }

  }


  // pce = PIECES.wP;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score += PawnTable[sq120to64(sq)];
  // }

  // pce = PIECES.bP;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score -= PawnTable[mirror64(sq120to64(sq))];
  // }

  // pce = PIECES.wN;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score += KnightTable[sq120to64(sq)];
  // }

  // pce = PIECES.bN;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score -= KnightTable[mirror64(sq120to64(sq))];
  // }

  // pce = PIECES.wB;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score += BishopTable[sq120to64(sq)];
  // }

  // pce = PIECES.bB;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score -= BishopTable[mirror64(sq120to64(sq))];
  // }

  // pce = PIECES.wR;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score += RookTable[sq120to64(sq)];
  // }

  // pce = PIECES.bR;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score -= RookTable[mirror64(sq120to64(sq))];
  // }

  // pce = PIECES.wQ;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score += RookTable[sq120to64(sq)];
  // }

  // pce = PIECES.bQ;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score -= RookTable[mirror64(sq120to64(sq))];
  // }

  // pce = PIECES.wK;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score += SearchController.endgame
  //     ? EndKingTable[sq120to64(sq)]
  //     : KingTable[sq120to64(sq)];
  // }

  // pce = PIECES.bK;
  // for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
  //   sq = GameBoard.pList[getPieceIndex(pce, pceNum)];
  //   score -= SearchController.endgame
  //     ? EndKingTable[mirror64(sq120to64(sq))]
  //     : KingTable[mirror64(sq120to64(sq))];
  // }

  if (GameBoard.pceNum[PIECES.wB] >= 2) {
    score += BishopPair;
  }

  if (GameBoard.pceNum[PIECES.bB] >= 2) {
    score -= BishopPair;
  }

  if (GameBoard.side == COLOURS.WHITE) {
    return score;
  } else {
    return -score;
  }
}
