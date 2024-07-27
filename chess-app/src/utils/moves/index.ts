import { type Piece, type Square } from '../../types'

export function areSameSquare (
  first: Square | null,
  second: Square | null
): boolean {
  if (!first || !second) {
    return false
  }

  return first.rank === second.rank && first.file === second.file
}

export function capture (piece: Piece): Piece {
  return {
    color: piece.color,
    points: piece.points,
    rank: piece.rank,
    file: piece.file,
    type: piece.type
  }
}
export function findPieceBySquare (pieces: Piece[], file: string, rank: string) {
  if (pieces) return pieces.find((p) => p.file === file && p.rank === rank)
}
