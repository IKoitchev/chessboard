export interface Square {
  // color: Color;
  rank: Row
  file: Column
}

export type Color = 'black' | 'white'

export type Row = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'

export type Column = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'

export interface Piece {
  rank: Row
  file: Column
  color: Color
  points: number
  type: PieceType
}
export type PieceType =
  | 'Pawn'
  | 'King'
  | 'Bishop'
  | 'Queen'
  | 'Knight'
  | 'Rook'

export interface Game {
  id: string
  playerWhite: Player
  playerBlack: Player
  pieces: Piece[]
  moves: Move[]
  result?: GameState
}

export type GameState =
  | 'draw'
  | 'stalemate'
  | `${Color} in check`
  | `${Color} win`
  | null

export type SquareContext = Square & {
  piece?: Piece
}

export interface Player {
  id: string
  // name: string;
  // ...
}

export interface Move {
  id: string
  targetFile: Column
  targetRank: Row
  piece: string
  gameId: string
}
