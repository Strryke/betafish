const engine = function () {
  /****************************\
   ============================
   
    Board Constants
   ============================              
  \****************************/

  const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const PceChar = ".PNBRQKpnbrqk";
  const SideChar = "wb-";
  const RankChar = "12345678";
  const FileChar = "abcdefgh";
  const MFLAGEP = 0x40000;
  const MFLAGPS = 0x80000;
  const MFLAGCA = 0x1000000;
  const MFLAGCAP = 0x7c000;
  const MFLAGPROM = 0xf00000;
  const NOMOVE = 0;

  // prettier-ignore
  const CastlePerm = [
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15,  7, 15, 15, 15,  3, 15, 15, 11, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15
  ];

  //prettier-ignore
  {
    var PIECES =  { EMPTY: 0, wP: 1, wN: 2, wB: 3,wR: 4, wQ: 5, wK: 6, bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12  };
    var BRD_SQ_NUM = 120;
    var FILES =  { FILE_A:0, FILE_B:1, FILE_C:2, FILE_D:3, 
    FILE_E:4, FILE_F:5, FILE_G:6, FILE_H:7, FILE_NONE:8 };
    var RANKS =  { RANK_1:0, RANK_2:1, RANK_3:2, RANK_4:3, 
    RANK_5:4, RANK_6:5, RANK_7:6, RANK_8:7, RANK_NONE:8 };
    var COLOURS = { WHITE:0, BLACK:1, BOTH:2 };
    var CASTLEBIT = { WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8 };
    var SQUARES = {
    A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,  
    A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98, 
    NO_SQ:99, OFFBOARD:100
    };
    var MAXGAMEMOVES = 2048;
    var MAXPOSITIONMOVES = 256;
    var MAXDEPTH = 64;
    var INFINITE = 30000;
    var MATE = 29000;
    var PVENTRIES = 10000;

    var FilesBrd = new Array(BRD_SQ_NUM);
    var RanksBrd = new Array(BRD_SQ_NUM);
  }

  // prettier-ignore
  {
  var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
  var PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
  COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ];
  
  var PiecePawn = [ 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ];	
  var PieceKnight = [ 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ];
  var PieceKing = [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ];
  var PieceRookQueen = [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0 ];
  var PieceBishopQueen = [ 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0 ];
  var PieceSlides = [ 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0 ];
  var Kings = [PIECES.wK, PIECES.bK];

  
  var KnDir = [ -8, -19,	-21, -12, 8, 19, 21, 12 ];
  var RkDir = [ -1, -10,	1, 10 ];
  var BiDir = [ -9, -11, 11, 9 ];
  var KiDir = [ -1, -10,	1, 10, -9, -11, 11, 9 ];
  
  var DirNum = [ 0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8 ];
  var PceDir = [ 0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir ];
  var LoopNonSlidePce = [ PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0 ];
  var LoopNonSlideIndex = [ 0, 3 ];
  var LoopSlidePce = [ PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0 ];
  var LoopSlideIndex = [ 0, 4];
  
  var PieceKeys = new Array(14 * 120);
  var SideKey;
  var CastleKeys = new Array(16);
  
  var Sq120ToSq64 = new Array(BRD_SQ_NUM);
  var Sq64ToSq120 = new Array(64);
  }

  /****************************\
   ============================
   
    Board Helper Functions
   ============================              
  \****************************/

  function getRand32() {
    return (
      (Math.floor(Math.random() * 255 + 1) << 23) |
      (Math.floor(Math.random() * 255 + 1) << 16) |
      (Math.floor(Math.random() * 255 + 1) << 8) |
      Math.floor(Math.random() * 255 + 1)
    );
  }

  function fileRanktoSquare(f, r) {
    return 21 + f + r * 10;
  }

  function isSqOffBoard(sq) {
    return FilesBrd[sq] == SQUARES.OFFBOARD;
  }

  function hashPiece(pce, sq) {
    GameBoard.posKey ^= PieceKeys[pce * 120 + sq];
  }

  function hashCastle() {
    GameBoard.posKey ^= CastleKeys[GameBoard.castlePerm];
  }
  function hashSide() {
    GameBoard.posKey ^= SideKey;
  }
  function hashEnPas() {
    GameBoard.posKey ^= PieceKeys[GameBoard.enPas];
  }

  function sq120to64(sq120) {
    return Sq120ToSq64[sq120];
  }

  function sq64to120(sq64) {
    return Sq64ToSq120[sq64];
  }

  function getPieceIndex(pce, pceNum) {
    return pce * 10 + pceNum;
  }

  function mirror64(sq) {
    return Mirror64[sq];
  }

  /*
  0000 0000 0000 0000 0000 0111 1111 -> From 0x7F
  0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F
  0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xF
  0000 0000 0100 0000 0000 0000 0000 -> EP 0x40000
  0000 0000 1000 0000 0000 0000 0000 -> Pawn Start 0x80000
  0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece >> 20, 0xF
  0001 0000 0000 0000 0000 0000 0000 -> Castle 0x1000000
  */

  function fromSQ(m) {
    return m & 0x7f;
  }
  function toSQ(m) {
    return (m >> 7) & 0x7f;
  }
  function CAPTURED(m) {
    return (m >> 14) & 0xf;
  }
  function PROMOTED(m) {
    return (m >> 20) & 0xf;
  }

  /****************************\
   ============================
   
    Gameboard
   ============================              
  \****************************/

  function getPieceIndex(pce, pceNum) {
    return pce * 10 + pceNum;
  }

  let GameBoard = {};

  GameBoard.pieces = new Array(BRD_SQ_NUM);
  GameBoard.side = COLOURS.WHITE;
  GameBoard.fiftyMove = 0;
  GameBoard.hisPly = 0;
  GameBoard.history = [];
  GameBoard.ply = 0;
  GameBoard.enPas = 0;
  GameBoard.castlePerm = 0;
  GameBoard.material = new Array(2); // WHITE,BLACK material of pieces
  GameBoard.pceNum = new Array(13); // indexed by Pce
  GameBoard.pList = new Array(14 * 10);
  GameBoard.posKey = 0;
  GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
  GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
  GameBoard.moveListStart = new Array(MAXDEPTH);
  GameBoard.PvTable = [];
  GameBoard.PvArray = new Array(MAXDEPTH);
  GameBoard.searchHistory = new Array(14 * BRD_SQ_NUM);
  GameBoard.searchKillers = new Array(3 * MAXDEPTH);
  GameBoard.GameOver = false;

  function PrintBoard() {
    var sq, file, rank, piece;

    console.log("\nGame Board:\n");
    for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
      var line = RankChar[rank] + "  ";
      for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
        sq = fileRanktoSquare(file, rank);
        piece = GameBoard.pieces[sq];
        line += " " + PceChar[piece] + " ";
      }
      console.log(line);
    }

    console.log("");
    var line = "   ";
    for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
      line += " " + FileChar[file] + " ";
    }

    console.log(line);
    console.log("side:" + SideChar[GameBoard.side]);
    console.log("enPas:" + GameBoard.enPas);
    line = "";

    if (GameBoard.castlePerm & CASTLEBIT.WKCA) line += "K";
    if (GameBoard.castlePerm & CASTLEBIT.WQCA) line += "Q";
    if (GameBoard.castlePerm & CASTLEBIT.BKCA) line += "k";
    if (GameBoard.castlePerm & CASTLEBIT.BQCA) line += "q";
    console.log("castle:" + line);
    console.log("key:" + GameBoard.posKey.toString(16));
  }

  function GenerateFEN() {
    var fenStr = "";
    var rank, file, sq, piece;
    var emptyCount = 0;

    for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
      emptyCount = 0;
      for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
        sq = fileRanktoSquare(file, rank);
        piece = GameBoard.pieces[sq];
        if (piece == PIECES.EMPTY) {
          emptyCount++;
        } else {
          if (emptyCount != 0) {
            fenStr += emptyCount.toString();
          }
          emptyCount = 0;
          fenStr += PceChar[piece];
        }
      }
      if (emptyCount != 0) {
        fenStr += emptyCount.toString();
      }

      if (rank != RANKS.RANK_1) {
        fenStr += "/";
      } else {
        fenStr += " ";
      }
    }

    fenStr += SideChar[GameBoard.side] + " ";

    if (GameBoard.castlePerm == 0) {
      fenStr += "- ";
    } else {
      if (GameBoard.castlePerm & CASTLEBIT.WKCA) fenStr += "K";
      if (GameBoard.castlePerm & CASTLEBIT.WQCA) fenStr += "Q";
      if (GameBoard.castlePerm & CASTLEBIT.BKCA) fenStr += "k";
      if (GameBoard.castlePerm & CASTLEBIT.BQCA) fenStr += "q";
    }

    if (GameBoard.enPas == SQUARES.NO_SQ) {
      fenStr += " -";
    }

    fenStr += " ";
    fenStr += GameBoard.fiftyMove;
    fenStr += " ";
    var tempHalfMove = GameBoard.hisPly;
    if (GameBoard.side == COLOURS.BLACK) {
      tempHalfMove--;
    }
    fenStr += tempHalfMove / 2;

    console.log(fenStr);

    return fenStr;
  }

  function ParseMove(from, to) {
    GenerateMoves();

    var Move = NOMOVE;
    var PromPce = PIECES.EMPTY;
    var found = false;

    for (
      index = GameBoard.moveListStart[GameBoard.ply];
      index < GameBoard.moveListStart[GameBoard.ply + 1];
      ++index
    ) {
      Move = GameBoard.moveList[index];
      if (fromSQ(Move) == from && toSQ(Move) == to) {
        PromPce = PROMOTED(Move);
        if (PromPce != PIECES.EMPTY) {
          if (
            (PromPce == PIECES.wQ && GameBoard.side == COLOURS.WHITE) ||
            (PromPce == PIECES.bQ && GameBoard.side == COLOURS.BLACK)
          ) {
            found = true;
            break;
          }
          continue;
        }
        found = true;
        break;
      }
    }

    if (found != false) {
      if (MakeMove(Move) == false) {
        return NOMOVE;
      }
      TakeMove();
      return Move;
    }

    return NOMOVE;
  }

  function GeneratePosKey() {
    var sq = 0;
    var finalKey = 0;
    var piece = PIECES.EMPTY;

    for (sq = 0; sq < BRD_SQ_NUM; ++sq) {
      piece = GameBoard.pieces[sq];
      if (piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
        finalKey ^= PieceKeys[piece * 120 + sq];
      }
    }

    if (GameBoard.side == COLOURS.WHITE) {
      finalKey ^= SideKey;
    }

    if (GameBoard.enPas != SQUARES.NO_SQ) {
      finalKey ^= PieceKeys[GameBoard.enPas];
    }

    finalKey ^= CastleKeys[GameBoard.castlePerm];

    return finalKey;
  }

  function PrintPieceLists() {
    var piece, pceNum;

    for (piece = PIECES.wP; piece <= PIECES.bK; ++piece) {
      for (pceNum = 0; pceNum < GameBoard.pceNum[piece]; ++pceNum) {
        console.log(
          "Piece " +
            PceChar[piece] +
            " on " +
            PrSq(GameBoard.pList[getPieceIndex(piece, pceNum)])
        );
      }
    }
  }

  function UpdateListsMaterial() {
    var piece, sq, index, colour;

    for (index = 0; index < 14 * 120; ++index) {
      GameBoard.pList[index] = PIECES.EMPTY;
    }

    for (index = 0; index < 2; ++index) {
      GameBoard.material[index] = 0;
    }

    for (index = 0; index < 13; ++index) {
      GameBoard.pceNum[index] = 0;
    }

    for (index = 0; index < 64; ++index) {
      sq = sq64to120(index);
      piece = GameBoard.pieces[sq];
      if (piece != PIECES.EMPTY) {
        colour = PieceCol[piece];

        GameBoard.material[colour] += PieceVal[piece];

        GameBoard.pList[getPieceIndex(piece, GameBoard.pceNum[piece])] = sq;
        GameBoard.pceNum[piece]++;
      }
    }
  }

  function ResetBoard() {
    var index = 0;

    for (index = 0; index < BRD_SQ_NUM; ++index) {
      GameBoard.pieces[index] = SQUARES.OFFBOARD;
    }

    for (index = 0; index < 64; ++index) {
      GameBoard.pieces[sq64to120(index)] = PIECES.EMPTY;
    }

    GameBoard.side = COLOURS.BOTH;
    GameBoard.enPas = SQUARES.NO_SQ;
    GameBoard.fiftyMove = 0;
    GameBoard.ply = 0;
    GameBoard.hisPly = 0;
    GameBoard.castlePerm = 0;
    GameBoard.posKey = 0;
    GameBoard.moveListStart[GameBoard.ply] = 0;
    GameBoard.GameOver = false;
  }

  //rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

  function ParseFen(fen) {
    ResetBoard();

    var rank = RANKS.RANK_8;
    var file = FILES.FILE_A;
    var piece = 0;
    var count = 0;
    var i = 0;
    var sq120 = 0;
    var fenCnt = 0; // fen[fenCnt]

    // prettier-ignore
    while ((rank >= RANKS.RANK_1) && fenCnt < fen.length) {
        count = 1;
      switch (fen[fenCnt]) {
        case 'p': piece = PIECES.bP; break;
              case 'r': piece = PIECES.bR; break;
              case 'n': piece = PIECES.bN; break;
              case 'b': piece = PIECES.bB; break;
              case 'k': piece = PIECES.bK; break;
              case 'q': piece = PIECES.bQ; break;
              case 'P': piece = PIECES.wP; break;
              case 'R': piece = PIECES.wR; break;
              case 'N': piece = PIECES.wN; break;
              case 'B': piece = PIECES.wB; break;
              case 'K': piece = PIECES.wK; break;
              case 'Q': piece = PIECES.wQ; break;
  
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
                  piece = PIECES.EMPTY;
                  count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                  break;
              
              case '/':
              case ' ':
                  rank--;
                  file = FILES.FILE_A;
                  fenCnt++;
                  continue;  
              default:
                  console.log("FEN error");
                  return;
  
      }
      
      for (i = 0; i < count; i++) {	
        sq120 = fileRanktoSquare(file,rank);            
              GameBoard.pieces[sq120] = piece;
        file++;
          }
      fenCnt++;
    } // while loop end

    //rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
    GameBoard.side = fen[fenCnt] == "w" ? COLOURS.WHITE : COLOURS.BLACK;
    fenCnt += 2;

    for (i = 0; i < 4; i++) {
      if (fen[fenCnt] == " ") {
        break;
      }
      switch (fen[fenCnt]) {
        case "K":
          GameBoard.castlePerm |= CASTLEBIT.WKCA;
          break;
        case "Q":
          GameBoard.castlePerm |= CASTLEBIT.WQCA;
          break;
        case "k":
          GameBoard.castlePerm |= CASTLEBIT.BKCA;
          break;
        case "q":
          GameBoard.castlePerm |= CASTLEBIT.BQCA;
          break;
        default:
          break;
      }
      fenCnt++;
    }
    fenCnt++;

    if (fen[fenCnt] != "-") {
      file = fen[fenCnt].charCodeAt() - "a".charCodeAt();
      rank = fen[fenCnt + 1].charCodeAt() - "1".charCodeAt();
      console.log(
        "fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank
      );
      GameBoard.enPas = fileRanktoSquare(file, rank);
    }

    GameBoard.posKey = GeneratePosKey();
    UpdateListsMaterial();
  }

  function PrintSqAttacked() {
    var sq, file, rank, piece;

    console.log("\nAttacked:\n");

    for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
      var line = rank + 1 + "  ";
      for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
        sq = fileRanktoSquare(file, rank);
        if (SqAttacked(sq, GameBoard.side ^ 1) == true) piece = "X";
        else piece = "-";
        line += " " + piece + " ";
      }
      console.log(line);
    }

    console.log("");
  }

  function SqAttacked(sq, side) {
    var pce;
    var t_sq;
    var index;

    if (side == COLOURS.WHITE) {
      if (
        GameBoard.pieces[sq - 11] == PIECES.wP ||
        GameBoard.pieces[sq - 9] == PIECES.wP
      ) {
        return true;
      }
    } else {
      if (
        GameBoard.pieces[sq + 11] == PIECES.bP ||
        GameBoard.pieces[sq + 9] == PIECES.bP
      ) {
        return true;
      }
    }

    for (index = 0; index < 8; index++) {
      pce = GameBoard.pieces[sq + KnDir[index]];
      if (
        pce != SQUARES.OFFBOARD &&
        PieceCol[pce] == side &&
        PieceKnight[pce] == true
      ) {
        return true;
      }
    }

    for (index = 0; index < 4; ++index) {
      dir = RkDir[index];
      t_sq = sq + dir;
      pce = GameBoard.pieces[t_sq];
      while (pce != SQUARES.OFFBOARD) {
        if (pce != PIECES.EMPTY) {
          if (PieceRookQueen[pce] == true && PieceCol[pce] == side) {
            return true;
          }
          break;
        }
        t_sq += dir;
        pce = GameBoard.pieces[t_sq];
      }
    }

    for (index = 0; index < 4; ++index) {
      dir = BiDir[index];
      t_sq = sq + dir;
      pce = GameBoard.pieces[t_sq];
      while (pce != SQUARES.OFFBOARD) {
        if (pce != PIECES.EMPTY) {
          if (PieceBishopQueen[pce] == true && PieceCol[pce] == side) {
            return true;
          }
          break;
        }
        t_sq += dir;
        pce = GameBoard.pieces[t_sq];
      }
    }

    for (index = 0; index < 8; index++) {
      pce = GameBoard.pieces[sq + KiDir[index]];
      if (
        pce != SQUARES.OFFBOARD &&
        PieceCol[pce] == side &&
        PieceKing[pce] == true
      ) {
        return true;
      }
    }

    return false;
  }

  /****************************\
   ============================
   
    Public API
   ============================              
  \****************************/

  return {
    test: () => {
      ParseFen(START_FEN);
      PrintBoard();
    },
    getFEN: () => {
      return GenerateFEN();
    },
    setFEN: (fen) => {
      ParseFen(fen);
      PrintBoard();
    },
  };
};
