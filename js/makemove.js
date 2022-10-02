function ClearPiece(sq) {
  var pce = GameBoard.pieces[sq];
  var col = PieceCol[pce];
  var index;
  var t_pceNum = -1;

  hashPiece(pce, sq);

  GameBoard.pieces[sq] = PIECES.EMPTY;
  GameBoard.material[col] -= PieceVal[pce];

  for (index = 0; index < GameBoard.pceNum[pce]; ++index) {
    if (GameBoard.pList[getPieceIndex(pce, index)] == sq) {
      t_pceNum = index;
      break;
    }
  }

  GameBoard.pceNum[pce]--;
  GameBoard.pList[getPieceIndex(pce, t_pceNum)] =
    GameBoard.pList[getPieceIndex(pce, GameBoard.pceNum[pce])];
}

function AddPiece(sq, pce) {
  var col = PieceCol[pce];

  hashPiece(pce, sq);

  GameBoard.pieces[sq] = pce;
  GameBoard.material[col] += PieceVal[pce];
  GameBoard.pList[getPieceIndex(pce, GameBoard.pceNum[pce])] = sq;
  GameBoard.pceNum[pce]++;
}

function MovePiece(from, to) {
  var index = 0;
  var pce = GameBoard.pieces[from];

  hashPiece(pce, from);
  GameBoard.pieces[from] = PIECES.EMPTY;

  hashPiece(pce, to);
  GameBoard.pieces[to] = pce;

  for (index = 0; index < GameBoard.pceNum[pce]; ++index) {
    if (GameBoard.pList[getPieceIndex(pce, index)] == from) {
      GameBoard.pList[getPieceIndex(pce, index)] = to;
      break;
    }
  }
}

function MakeMove(move) {
  var from = fromSQ(move);
  var to = toSQ(move);
  var side = GameBoard.side;

  GameBoard.history[GameBoard.hisPly].posKey = GameBoard.posKey;

  if ((move & MFLAGEP) != 0) {
    if (side == COLOURS.WHITE) {
      ClearPiece(to - 10);
    } else {
      ClearPiece(to + 10);
    }
  } else if ((move & MFLAGCA) != 0) {
    switch (to) {
      case SQUARES.C1:
        MovePiece(SQUARES.A1, SQUARES.D1);
        break;
      case SQUARES.C8:
        MovePiece(SQUARES.A8, SQUARES.D8);
        break;
      case SQUARES.G1:
        MovePiece(SQUARES.H1, SQUARES.F1);
        break;
      case SQUARES.G8:
        MovePiece(SQUARES.H8, SQUARES.F8);
        break;
      default:
        break;
    }
  }

  if (GameBoard.enPas != SQUARES.NO_SQ) hashEnPas();
  hashCastle();

  GameBoard.history[GameBoard.hisPly].move = move;
  GameBoard.history[GameBoard.hisPly].fiftyMove = GameBoard.fiftyMove;
  GameBoard.history[GameBoard.hisPly].enPas = GameBoard.enPas;
  GameBoard.history[GameBoard.hisPly].castlePerm = GameBoard.castlePerm;

  GameBoard.castlePerm &= CastlePerm[from];
  GameBoard.castlePerm &= CastlePerm[to];
  GameBoard.enPas = SQUARES.NO_SQ;

  hashCastle();

  var captured = CAPTURED(move);
  GameBoard.fiftyMove++;

  if (captured != PIECES.EMPTY) {
    ClearPiece(to);
    GameBoard.fiftyMove = 0;
  }

  GameBoard.hisPly++;
  GameBoard.ply++;

  if (PiecePawn[GameBoard.pieces[from]] == true) {
    GameBoard.fiftyMove = 0;
    if ((move & MFLAGPS) != 0) {
      if (side == COLOURS.WHITE) {
        GameBoard.enPas = from + 10;
      } else {
        GameBoard.enPas = from - 10;
      }
      hashEnPas();
    }
  }

  MovePiece(from, to);

  var prPce = PROMOTED(move);
  if (prPce != PIECES.EMPTY) {
    ClearPiece(to);
    AddPiece(to, prPce);
  }

  GameBoard.side ^= 1;
  hashSide();

  if (
    SqAttacked(GameBoard.pList[getPieceIndex(Kings[side], 0)], GameBoard.side)
  ) {
    TakeMove();
    return false;
  }

  return true;
}

function TakeMove() {
  GameBoard.hisPly--;
  GameBoard.ply--;

  var move = GameBoard.history[GameBoard.hisPly].move;
  var from = fromSQ(move);
  var to = toSQ(move);

  if (GameBoard.enPas != SQUARES.NO_SQ) hashEnPas();
  hashCastle();

  GameBoard.castlePerm = GameBoard.history[GameBoard.hisPly].castlePerm;
  GameBoard.fiftyMove = GameBoard.history[GameBoard.hisPly].fiftyMove;
  GameBoard.enPas = GameBoard.history[GameBoard.hisPly].enPas;

  if (GameBoard.enPas != SQUARES.NO_SQ) hashEnPas();
  hashCastle();

  GameBoard.side ^= 1;
  hashSide();

  if ((MFLAGEP & move) != 0) {
    if (GameBoard.side == COLOURS.WHITE) {
      AddPiece(to - 10, PIECES.bP);
    } else {
      AddPiece(to + 10, PIECES.wP);
    }
  } else if ((MFLAGCA & move) != 0) {
    switch (to) {
      case SQUARES.C1:
        MovePiece(SQUARES.D1, SQUARES.A1);
        break;
      case SQUARES.C8:
        MovePiece(SQUARES.D8, SQUARES.A8);
        break;
      case SQUARES.G1:
        MovePiece(SQUARES.F1, SQUARES.H1);
        break;
      case SQUARES.G8:
        MovePiece(SQUARES.F8, SQUARES.H8);
        break;
      default:
        break;
    }
  }

  MovePiece(to, from);

  var captured = CAPTURED(move);
  if (captured != PIECES.EMPTY) {
    AddPiece(to, captured);
  }

  if (PROMOTED(move) != PIECES.EMPTY) {
    ClearPiece(from);
    AddPiece(
      from,
      PieceCol[PROMOTED(move)] == COLOURS.WHITE ? PIECES.wP : PIECES.bP
    );
  }
}

function CheckValidMove(from, to) {
  console.log(from, to);
  let move = `${from}${to}`;
  let moveList = getMoveList();
  console.log(moveList);

  return moveList.includes(move);
}

function ThreeFoldRep() {
  var i = 0,
    r = 0;

  for (i = 0; i < GameBoard.hisPly; ++i) {
    if (GameBoard.history[i].posKey == GameBoard.posKey) {
      r++;
    }
  }
  return r;
}

function DrawMaterial() {
  if (GameBoard.pceNum[PIECES.wP] != 0 || GameBoard.pceNum[PIECES.bP] != 0)
    return false;
  if (
    GameBoard.pceNum[PIECES.wQ] != 0 ||
    GameBoard.pceNum[PIECES.bQ] != 0 ||
    GameBoard.pceNum[PIECES.wR] != 0 ||
    GameBoard.pceNum[PIECES.bR] != 0
  )
    return false;
  if (GameBoard.pceNum[PIECES.wB] > 1 || GameBoard.pceNum[PIECES.bB] > 1) {
    return false;
  }
  if (GameBoard.pceNum[PIECES.wN] > 1 || GameBoard.pceNum[PIECES.bN] > 1) {
    return false;
  }

  if (GameBoard.pceNum[PIECES.wN] != 0 && GameBoard.pceNum[PIECES.wB] != 0) {
    return false;
  }
  if (GameBoard.pceNum[PIECES.bN] != 0 && GameBoard.pceNum[PIECES.bB] != 0) {
    return false;
  }

  return true;
}
