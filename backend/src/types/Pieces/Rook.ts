import { Color, Piece, PieceType, Square, File, Rank } from "@chessboard/types";

export class Rook implements Piece {
  color: Color;
  points: number;
  type: PieceType;
  rank: Rank;
  file: File;

  constructor(square: Square, color: Color) {
    this.color = color;
    this.type = this.constructor.name as PieceType;
    this.rank = square.rank;
    this.file = square.file;
    this.points = 5;
  }
}
