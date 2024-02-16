import { Color, Piece, Square } from "@chessboard/types";

/**
 * Check if there is a piece on a given square
 * If color is provided, check if there is a piece of the same color
 */

export function squareHasPiece(square: Square, pieces: Piece[], color?: Color) {
  return pieces.find(
    (p) =>
      p.file === square.file &&
      p.rank === square.rank &&
      (color ? color === p.color : true)
  );
}
