import { Color, Piece, Square } from "@chessboard/types";
import { letters, numbers } from "./squares";

export function getHorizontalAndVerticalMoves(
  start: Square,
  pieces: Piece[],
  pieceColor: Color
) {
  const { rank, file } = start;

  let moves: Square[] = [];

  const maxDistanceUp = 7 - numbers.indexOf(rank);
  const maxDistanceDown = numbers.indexOf(rank);
  const maxDistanceRight = 7 - letters.indexOf(file);
  const maxDistanceLeft = letters.indexOf(file);

  console.log("start", rank, file);
  // console.log(pieces.length);

  console.log("maxDistanceDown", maxDistanceDown);
  console.log("maxDistanceUp", maxDistanceUp);
  console.log("maxDistanceLeft", maxDistanceLeft);
  console.log("maxDistanceRight", maxDistanceRight);

  // Right
  for (let n = 0; n < maxDistanceRight; n++) {
    // console.log("right");
    const square: Square = {
      rank: rank,
      file: letters[letters.indexOf(file) + n + 1],
    };
    // console.log(square);
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      console.log("breaking", square);
      break;
    }

    console.log("adding");
    moves.push(square);

    if (pieces.find((p) => p.file === square.file && p.rank === square.rank)) {
      console.log("breaking later", square);
      break;
    }
  }

  // Left
  for (let n = 0; n < maxDistanceLeft; n++) {
    // console.log("left", maxDistanceLeft);
    console.log(file, letters.indexOf(file), letters[letters.indexOf(file)]);
    const square: Square = {
      rank: rank,
      file: letters[letters.indexOf(file) - n - 1],
    };
    // console.log(square);
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      console.log("breaking", square);
      break;
    }

    console.log("adding");
    moves.push(square);

    if (pieces.find((p) => p.file === square.file && p.rank === square.rank)) {
      console.log("breaking later", square);
      break;
    }
  }

  // Up
  for (let n = 0; n < maxDistanceUp; n++) {
    // console.log("up");
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) + n + 1],
      file: file,
    };
    // console.log(square);
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      console.log("breaking", square);
      break;
    }

    console.log("adding");
    moves.push(square);

    if (pieces.find((p) => p.file === square.file && p.rank === square.rank)) {
      console.log("breaking later", square);
      break;
    }
  }

  // Down
  for (let n = 0; n < maxDistanceDown; n++) {
    // console.log("down");
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) - n - 1],
      file: file,
    };
    // console.log(square);
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      console.log("breaking", square);
      break;
    }

    console.log("adding");
    moves.push(square);

    if (pieces.find((p) => p.file === square.file && p.rank === square.rank)) {
      console.log("breaking later", square);
      break;
    }
  }
  console.log("moves", moves);
  return moves;
}
export function getDiagonalMoves(
  start: Square,
  pieces: Piece[],
  pieceColor: Color
) {
  const { rank, file } = start;

  let moves: Square[] = [];

  const maxDistanceUp = 7 - numbers.indexOf(rank);
  const maxDistanceDown = numbers.indexOf(rank);
  const maxDistanceRight = 7 - letters.indexOf(file);
  const maxDistanceLeft = letters.indexOf(file);

  // Up-Right
  for (let n = 0; n < maxDistanceRight && n < maxDistanceUp; n++) {
    // console.log("up-right");
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) + n + 1],
      file: letters[letters.indexOf(file) + n + 1],
    };
    // console.log(square);
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      console.log("breaking", square);
      break;
    }

    console.log("adding");
    moves.push(square);

    if (pieces.find((p) => p.file === square.file && p.rank === square.rank)) {
      console.log("breaking later", square);
      break;
    }
  }

  // Down-Right
  for (let n = 0; n < maxDistanceRight && n < maxDistanceDown; n++) {
    // console.log("down-right");
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) - n - 1],
      file: letters[letters.indexOf(file) + n + 1],
    };
    // console.log(square);
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      console.log("breaking", square);
      break;
    }

    console.log("adding");
    moves.push(square);

    if (pieces.find((p) => p.file === square.file && p.rank === square.rank)) {
      console.log("breaking later", square);
      break;
    }
  }

  // Up-Left
  for (let n = 0; n < maxDistanceLeft && n < maxDistanceUp; n++) {
    // console.log("left-up");
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) + n + 1],
      file: letters[letters.indexOf(file) - n - 1],
    };
    // console.log(square);
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      console.log("breaking", square);
      break;
    }

    console.log("adding");
    moves.push(square);

    if (pieces.find((p) => p.file === square.file && p.rank === square.rank)) {
      console.log("breaking later", square);
      break;
    }
  }
  // Down-Left
  for (let n = 0; n < maxDistanceLeft && n < maxDistanceDown; n++) {
    // console.log("left-down");
    const square: Square = {
      rank: numbers[numbers.indexOf(rank) - n - 1],
      file: letters[letters.indexOf(file) - n - 1],
    };
    // console.log(square);
    if (
      pieces.find(
        (p) =>
          p.file === square.file &&
          p.rank === square.rank &&
          p.color === pieceColor
      )
    ) {
      console.log("breaking", square);
      break;
    }

    console.log("adding");
    moves.push(square);

    if (pieces.find((p) => p.file === square.file && p.rank === square.rank)) {
      console.log("breaking later", square);
      break;
    }
  }
  console.log("moves", moves);
  return moves;
}
