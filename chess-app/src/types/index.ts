export type Square = {
  // color: Color;
  rank: Row;
  file: Column;
};

export type Color = "black" | "white";

export type Row = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export type Column = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export type Piece = {
  rank: Row;
  file: Column;
  color: Color;
  points: number;
  type: PieceType;
};
export type PieceType =
  | "Pawn"
  | "King"
  | "Bishop"
  | "Queen"
  | "Knight"
  | "Rook";

export type GameContext = {
  id: string;
  playerWhite: Player;
  playerBlack: Player;
  isBlackTurn: boolean;
  pieces: Piece[];
};

export type SquareContext = Square & {
  piece?: Piece;
};

export type Player = {
  id: string;
  // name: string;
  // ...
};
