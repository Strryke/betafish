// // value of pieces for evaluate function
// const pawn_value = 100;
// const knight_value = 320;
// const bishop_value = 330;
// const rook_value = 500;
// const queen_value = 900;
// const king_value = 20000;

// // Piece-Square Tables from the chessprogramming wiki for a simplified evaluation function https://www.chessprogramming.org/Simplified_Evaluation_Function
// var black_pawn = [
//   0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30,
//   20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10,
//   0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
// ];
// var white_pawn = reverse_array(black_pawn);
// var black_knight = [
//   -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30,
//   0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20,
//   15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40,
//   -50, -40, -30, -30, -30, -30, -40, -50,
// ];
// var white_knight = reverse_array(black_knight);
// var black_bishop = [
//   -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
//   10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0,
//   -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10,
//   -10, -10, -10, -10, -10, -20,
// ];
// var white_bishop = reverse_array(black_bishop);
// var black_rook = [
//   0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0,
//   -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0,
//   -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
// ];
// var white_rook = reverse_array(black_rook);
// var black_queen = [
//   -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
//   5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5,
//   5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10,
//   -20,
// ];
// var white_queen = reverse_array(black_queen);
// var black_king = [
//   -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
//   -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40,
//   -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20,
//   -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
// ];
// var white_king = reverse_array(black_king);
// var black_king_endgame = [
//   -50, -40, -30, -20, -20, -30, -40, -50, -30, -20, -10, 0, 0, -10, -20, -30,
//   -30, -10, 20, 30, 30, 20, -10, -30, -30, -10, 30, 40, 40, 30, -10, -30, -30,
//   -10, 30, 40, 40, 30, -10, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -30,
//   0, 0, 0, 0, -30, -30, -50, -30, -30, -30, -30, -30, -30, -50,
// ];

// function evaluate() {
//   if (game.in_checkmate()) {
//     return game.turn() === "w" ? 999999 : -999999;
//   }
//   if (game.in_threefold_repetition() || game.in_stalemate() || game.in_draw()) {
//     return game.turn() === "w" ? 999999 : -999999;
//   }

//   var total = 0;

//   // loop through the board
//   for (var i = 0; i < 8; i++) {
//     for (var j = 0; j < 8; j++) {
//       // get every piece
//       var piece = game.get(String.fromCharCode(97 + i) + (j + 1));

//       // exit as soon as possible if there's not piece
//       if (!piece) {
//         continue;
//       }

//       var index = j * 8 + i;
//       switch (piece.type) {
//         case "p":
//           total +=
//             piece.color == "w"
//               ? pawn_value + white_pawn[index]
//               : -(pawn_value + black_pawn[index]);
//           break;
//         case "n":
//           total +=
//             piece.color == "w"
//               ? knight_value + white_knight[index]
//               : -(knight_value + black_knight[index]);
//           break;
//         case "b":
//           total +=
//             piece.color == "w"
//               ? bishop_value + white_bishop[index]
//               : -(bishop_value + black_bishop[index]);
//           break;
//         case "r":
//           total +=
//             piece.color == "w"
//               ? rook_value + white_rook[index]
//               : -(rook_value + black_rook[index]);
//           break;
//         case "q":
//           total +=
//             piece.color == "w"
//               ? queen_value + white_queen[index]
//               : -(queen_value + black_queen[index]);
//           break;
//         case "k":
//           total +=
//             piece.color == "w"
//               ? king_value + white_king[index]
//               : -(king_value + black_king[index]);
//           break; // CHANGE TO "w/b_king_endgame" table on endgame positions
//       }
//     }
//   }

//   return game.turn() === "w" ? total : -total;
// }

var endgame = false;
var piecesCount;

const reverse_array = function (array) {
  return array.slice().reverse();
};

function evaluate() {
  const board = game.board();
  var totalEvaluation = 0;
  if (piecesCount <= 10) endgame = true;
  piecesCount = 0;

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (board[i][j] !== null) piecesCount++;

      totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
    }
  }

  return game.turn() === "w" ? totalEvaluation : -totalEvaluation;
}

var reverseArray = function (array) {
  return array.reverse();
};

var whitePawnEval = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
  [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
  [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
  [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
  [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
  [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

var blackPawnEval = reverseArray(whitePawnEval);

var knightEval = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
  [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
  [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
  [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
  [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
  [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
];

var whiteBishopEval = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
  [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
  [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
];

var blackBishopEval = reverseArray(whiteBishopEval);

var whiteRookEval = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
];

var blackRookEval = reverseArray(whiteRookEval);

var evalQueen = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
];

var whiteKingEval = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
  [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
];

var blackKingEval = reverseArray(whiteKingEval);

var kingEndGame = [
  [-5, -4, -3, -2, -2, -3, -4, -5],
  [-3, -2, -1, 0, 0, -1, -2, -3],
  [-3, -1, 2, 3, 3, 2, -1, -3],
  [-3, -1, 3, 4, 4, 3, -1, -3],
  [-3, -1, 3, 4, 4, 3, -1, -3],
  [-3, -1, 2, 3, 3, 2, -1, -3],
  [-3, -3, 0, 0, 0, 0, -3, -3],
  [-5, -3, -3, -3, -3, -3, -3, -5],
];

var getPieceValue = function (piece, x, y) {
  if (piece === null) {
    return 0;
  }

  var absoluteValue = getAbsoluteValue(piece, piece.color === "w", x, y);

  if (piece.color === "w") {
    return absoluteValue;
  } else {
    return -absoluteValue;
  }
};

var getAbsoluteValue = function (piece, isWhite, x, y) {
  if (piece.type === "p") {
    return 10 + (isWhite ? whitePawnEval[y][x] : blackPawnEval[y][x]);
  } else if (piece.type === "r") {
    return 50 + (isWhite ? whiteRookEval[y][x] : blackRookEval[y][x]);
  } else if (piece.type === "n") {
    return 30 + knightEval[y][x];
  } else if (piece.type === "b") {
    return 30 + (isWhite ? whiteBishopEval[y][x] : blackBishopEval[y][x]);
  } else if (piece.type === "q") {
    return 90 + evalQueen[y][x];
  } else if (piece.type === "k") {
    if (endgame) return 900 + kingEndGame[y][x];
    return 900 + (isWhite ? whiteKingEval[y][x] : blackKingEval[y][x]);
  }
};
