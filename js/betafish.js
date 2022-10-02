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

  /****************************\
   ============================
   
    Board Helper Functions
   ============================              
  \****************************/

  function FR2SQ(f, r) {
    return 21 + f + r * 10;
  }

  function test() {
    console.log(START_FEN);
  }

  /****************************\
   ============================
   
    Public API
   ============================              
  \****************************/

  return {
    test: () => test(),
  };
};
