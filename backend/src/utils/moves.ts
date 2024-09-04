import { Game, Piece, Square } from "@chessboard/types";
import { letters, numbers } from "./squares";
import { CalcMove } from "src/dto";
import { squareHasPiece, legalMoves as getLegalMoves } from "./moveUtils";

export function getHorizontalAndVerticalMoves(ctx: CalcMove) {
  const {
    start: { rank, file },
    color: pieceColor,
    pieces,
    adjacentOnly,
  } = ctx;

  const moves: Square[] = [];

  const maxDistanceUp = 7 - numbers.indexOf(rank);
  const maxDistanceDown = numbers.indexOf(rank);
  const maxDistanceRight = 7 - letters.indexOf(file);
  const maxDistanceLeft = letters.indexOf(file);

  // Right
  for (let n = 0; n < maxDistanceRight; n++) {
    const square: Square = {
      rank: rank,
      file: letters[letters.indexOf(file) + n + 1],
    };

    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      break;
    }
    moves.push(square);

    if (
      pieces.find((p) => p.file === square.file && p.rank === square.rank) ||
      adjacentOnly
    ) {
      break;
    }
  }

  // Left
  for (let n = 0; n < maxDistanceLeft; n++) {
    const square: Square = {
      rank: rank,
      file: letters[letters.indexOf(file) - n - 1],
    };
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      break;
    }
    moves.push(square);

    if (
      pieces.find((p) => p.file === square.file && p.rank === square.rank) ||
      adjacentOnly
    ) {
      break;
    }
  }

  // Up
  for (let n = 0; n < maxDistanceUp; n++) {
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) + n + 1],
      file: file,
    };
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      break;
    }
    moves.push(square);

    if (
      pieces.find((p) => p.file === square.file && p.rank === square.rank) ||
      adjacentOnly
    ) {
      break;
    }
  }

  // Down
  for (let n = 0; n < maxDistanceDown; n++) {
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) - n - 1],
      file: file,
    };
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      break;
    }

    moves.push(square);

    if (
      pieces.find((p) => p.file === square.file && p.rank === square.rank) ||
      adjacentOnly
    ) {
      break;
    }
  }
  return moves;
}
export function getDiagonalMoves(ctx: CalcMove) {
  const {
    start: { rank, file },
    color: pieceColor,
    pieces,
    adjacentOnly,
  } = ctx;

  const moves: Square[] = [];

  const maxDistanceUp = 7 - numbers.indexOf(rank);
  const maxDistanceDown = numbers.indexOf(rank);
  const maxDistanceRight = 7 - letters.indexOf(file);
  const maxDistanceLeft = letters.indexOf(file);

  // Up-Right
  for (let n = 0; n < maxDistanceRight && n < maxDistanceUp; n++) {
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) + n + 1],
      file: letters[letters.indexOf(file) + n + 1],
    };
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      break;
    }

    moves.push(square);

    if (
      pieces.find((p) => p.file === square.file && p.rank === square.rank) ||
      adjacentOnly
    ) {
      break;
    }
  }

  // Down-Right
  for (let n = 0; n < maxDistanceRight && n < maxDistanceDown; n++) {
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) - n - 1],
      file: letters[letters.indexOf(file) + n + 1],
    };
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      break;
    }
    moves.push(square);

    if (
      pieces.find((p) => p.file === square.file && p.rank === square.rank) ||
      adjacentOnly
    ) {
      break;
    }
  }

  // Up-Left
  for (let n = 0; n < maxDistanceLeft && n < maxDistanceUp; n++) {
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) + n + 1],
      file: letters[letters.indexOf(file) - n - 1],
    };
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      break;
    }
    moves.push(square);

    if (
      pieces.find((p) => p.file === square.file && p.rank === square.rank) ||
      adjacentOnly
    ) {
      break;
    }
  }
  // Down-Left
  for (let n = 0; n < maxDistanceLeft && n < maxDistanceDown; n++) {
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) - n - 1],
      file: letters[letters.indexOf(file) - n - 1],
    };
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      break;
    }
    moves.push(square);

    if (
      pieces.find((p) => p.file === square.file && p.rank === square.rank) ||
      adjacentOnly
    ) {
      break;
    }
  }
  return moves;
}
export function getLMoves(ctx: CalcMove) {
  const {
    start: { rank, file },
    color: pieceColor,
    pieces,
  } = ctx;

  const moves: Square[] = [];

  const coordinates = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [-1, 2],
    [1, -2],
    [-1, -2],
  ];

  for (const [x, y] of coordinates) {
    // new indexes
    const indexF = letters.indexOf(file) + x;
    const indexR = numbers.indexOf(rank) + y;

    if (indexR <= 7 && indexR >= 0 && indexF <= 7 && indexF >= 0) {
      const square: Square = { file: letters[indexF], rank: numbers[indexR] };

      if (
        !pieces.find(
          (piece) =>
            piece.file === square.file &&
            piece.rank === square.rank &&
            piece.color === pieceColor
        )
      ) {
        moves.push(square);
      }
    }
  }

  return moves;
}

export function getPawnMoves(mvoeInput: CalcMove) {
  const {
    start: { rank, file },
    color: pieceColor,
    pieces,
  } = mvoeInput;
  const moves: Square[] = [];

  // startRankIndex, promRankIndex, captureOffset
  const [startRankIndex, moveOffset] =
    pieceColor === "white" ? [1, 1] : [6, -1];

  const isBlocked = (moveOffset: number) => {
    if (
      pieces.find(
        (p) =>
          p.file === file &&
          numbers.indexOf(p.rank) === numbers.indexOf(rank) + moveOffset
      )
    ) {
      return true;
    }
    return false;
  };

  if (!isBlocked(moveOffset)) {
    moves.push({
      file,
      rank: numbers[numbers.indexOf(rank) + moveOffset],
    });
    if (
      numbers.indexOf(rank) === startRankIndex &&
      !isBlocked(moveOffset * 2)
    ) {
      moves.push({
        file,
        rank: numbers[numbers.indexOf(rank) + moveOffset * 2],
      });
    }
  }

  // Capturing
  const [left, right] = [
    {
      file: letters[letters.indexOf(file) - moveOffset],
      rank: numbers[numbers.indexOf(rank) + moveOffset],
    },
    {
      file: letters[letters.indexOf(file) + moveOffset],
      rank: numbers[numbers.indexOf(rank) + moveOffset],
    },
  ];

  if (
    left.file &&
    left.rank &&
    squareHasPiece(left, pieces, pieceColor === "white" ? "black" : "white")
  ) {
    moves.push(left);
  }

  if (
    right.file &&
    right.rank &&
    squareHasPiece(right, pieces, pieceColor === "white" ? "black" : "white")
  ) {
    moves.push(right);
  }
  return moves;
}

// Special moves

// export function getSpecialMoves(game: Game, piece: Piece) {

export function getCastleSquares(game: Game, king: Piece): Square[] {
  if (king.type !== "King") {
    return [];
  }

  // Check whether king has moved -> can't castle
  for (let i = 0; i < game.moves.length; i++) {
    const movedPiece: Piece = JSON.parse(game.moves[i].piece);
    if (movedPiece.type === king.type && movedPiece.color === king.color) {
      return [];
    }
  }

  // Check whether each rook has moved -> can't castle long or short respectively
  const rooks = game.pieces.filter(
    (p) =>
      p.type === "Rook" &&
      p.color === king.color &&
      p.rank === king.rank &&
      (p.file === "a" || p.file === "h")
  );

  if (rooks.length === 0) {
    return [];
  }

  // Rook we are castling to
  let castleRookSquare: Square[] = rooks.map((r) => {
    return { file: r.file, rank: r.rank };
  });

  for (const rook of rooks) {
    const firstMove = game.moves.find(
      (m) =>
        (JSON.parse(m.piece) as Piece).type === "Rook" &&
        (JSON.parse(m.piece) as Piece).color === rook.color &&
        (JSON.parse(m.piece) as Piece).file === rook.file &&
        (JSON.parse(m.piece) as Piece).rank === rook.rank
    );

    if (firstMove) {
      //this should be tested
      castleRookSquare = castleRookSquare.filter((sq) => sq.file !== rook.file);
    }
  }

  if (castleRookSquare.length === 0) {
    return [];
  }

  // Check whether there are any pieces between
  // The king and the rook -> can't castle

  for (const rook of castleRookSquare) {
    const kingFileIndex = letters.indexOf(king.file);
    const rookFileIndex = letters.indexOf(rook.file);

    // Short castle
    const short = kingFileIndex < rookFileIndex;

    for (const piece of game.pieces) {
      const pieceFileIndex = letters.indexOf(piece.file);

      if (piece.rank !== king.rank) continue;

      if (
        short &&
        pieceFileIndex > kingFileIndex &&
        pieceFileIndex < rookFileIndex
      ) {
        castleRookSquare = castleRookSquare.filter(
          (sq) => sq.file !== rook.file
        );
        break;
      }

      if (
        !short &&
        pieceFileIndex < kingFileIndex &&
        pieceFileIndex > rookFileIndex
      ) {
        castleRookSquare = castleRookSquare.filter(
          (sq) => sq.file !== rook.file
        );
        break;
      }
    }
  }

  for (const rookSq of castleRookSquare) {
    const kingFileIndex = letters.indexOf(king.file);
    const rookFileIndex = letters.indexOf(rookSq.file);
    const short = kingFileIndex < rookFileIndex;

    const kingSquares: Square[] = [
      { rank: king.rank, file: king.file },
      {
        rank: king.rank,
        file: short
          ? letters[letters.indexOf(king.file) + 1]
          : letters[letters.indexOf(king.file) - 1],
      },
      {
        rank: king.rank,
        file: short
          ? letters[letters.indexOf(king.file) + 2]
          : letters[letters.indexOf(king.file) - 2],
      },
    ];

    for (const square of kingSquares) {
      const enemyMoves = game.pieces.find((p) => {
        const options: CalcMove = {
          start: { rank: p.rank, file: p.file },
          pieces: game.pieces,
          color: p.color,
        };

        const legalMoves = getLegalMoves(p, options);

        if (
          p.color !== king.color &&
          legalMoves.some(
            (m) => m.file === square.file && m.rank === square.rank
          )
        ) {
          return true;
        }
        return false;
      });

      if (enemyMoves) {
        castleRookSquare = castleRookSquare.filter(
          (sq) => sq.file !== rookSq.file
        );
        // castleRookSquare.splice(castleRookSquare.indexOf(rookSq));
      }
    }
  }
  const kingSquares: Square[] = [];

  for (const rookSq of castleRookSquare) {
    const kingFileIndex = letters.indexOf(king.file);
    const rookFileIndex = letters.indexOf(rookSq.file);

    // Short castle
    const short = kingFileIndex < rookFileIndex;
    kingSquares.push({
      rank: king.rank,
      file: short
        ? letters[letters.indexOf(king.file) + 2]
        : letters[letters.indexOf(king.file) - 2],
    });
  }
  return kingSquares;
}

export function findEnPassant(
  game: Game,
  piece: Piece,
  moveNumber?: number
): Square | null {
  if (piece.type !== "Pawn") {
    return null;
  }

  if (moveNumber < 0) {
    return null;
  }

  if (!game.moves || game.moves.length === 0) {
    return null;
  }

  const lastMove = moveNumber ? game.moves[moveNumber] : game.moves.at(-1);
  const targetPiece: Piece = JSON.parse(lastMove.piece);

  const failConditions = [
    targetPiece.type !== "Pawn",
    Math.abs(
      letters.indexOf(piece.file) - letters.indexOf(lastMove.targetFile)
    ) !== 1,
    (piece.color === "white" && piece.rank !== "5") ||
      (piece.color === "black" && piece.rank !== "4"),
    (targetPiece.color === "white" && lastMove.targetRank !== "4") ||
      (targetPiece.color === "black" && lastMove.targetRank !== "5"),
    Math.abs(
      numbers.indexOf(targetPiece.rank) - numbers.indexOf(lastMove.targetRank)
    ) !== 2,
  ];

  if (failConditions.some(Boolean)) {
    return null;
  }

  const targetSquare: Square = {
    file: lastMove.targetFile,
    rank: targetPiece.color == "white" ? "3" : "6",
  };

  return targetSquare;
}

export function promote() {}
