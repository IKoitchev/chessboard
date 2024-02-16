import { Color, Piece, Square } from "@chessboard/types";
import { letters, numbers } from "./squares";
import { CalcMove } from "dto";
import { squareHasPiece } from "./moveUtils";

export function getHorizontalAndVerticalMoves(ctx: CalcMove) {
  const {
    start: { rank, file },
    color: pieceColor,
    pieces,
    adjacentOnly,
  } = ctx;

  let moves: Square[] = [];

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

  let moves: Square[] = [];

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

  let moves: Square[] = [];

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

export function getPawnMoves(ctx: CalcMove) {
  const {
    start: { rank, file },
    color: pieceColor,
    pieces,
  } = ctx;
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
    // console.log(file, numbers[numbers.indexOf(rank) + moveOffset]);
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
