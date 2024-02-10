import { Piece, Square } from "../../types";

export function areSameSquare(
  first: Square | null,
  second: Square | null
): boolean {
  if (!first || !second) {
    console.log("something is null");
    return false;
  }

  return first.rank === second.rank && first.file === second.file;
}

export function capture(piece: Piece): Piece {
  return {
    color: piece.color,
    points: piece.points,
    position: null,
    type: piece.type,
  };
}
export function findPieceBySquare(pieces: Piece[], file: string, rank: string) {
  return pieces.find(
    (p) => p.position?.file === file && p.position?.rank === rank
  );
}
