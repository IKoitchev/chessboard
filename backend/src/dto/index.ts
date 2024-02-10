import { Board, Piece, Square } from "@chessboard/types";

export type MakeMoveContext = {
  piece: Piece;
  target: Square;
  state: Board;
};
