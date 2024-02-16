import { Board, Color, Piece, Square } from "@chessboard/types";

export type MakeMoveContext = {
  piece: Piece;
  target: Square;
  state: Board;
};
export type CalcMove = {
  start: Square;
  pieces: Piece[];
  color: Color;
  adjacentOnly?: boolean;
};
