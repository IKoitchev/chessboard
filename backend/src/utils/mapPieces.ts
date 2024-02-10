import { Piece, Square } from "@chessboard/types";
import { Squares, letters, numbers } from "./squares";

export function mapPieces(pieces: Piece[]): Square[][] {
  const squares = [...[...Squares]];

  for (const piece of pieces) {
    squares[letters.indexOf(piece.file)][numbers.indexOf(piece.rank)].piece =
      piece;
  }

  console.log("squares", squares);
  return squares;
}
