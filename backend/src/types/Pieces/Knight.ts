import { Color, Piece, PieceType, Rank, Square, File } from "@chessboard/types";

export class Knight implements Piece {
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
    this.points = 3;
  }
}
