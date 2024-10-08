import { Color, Game, Piece, Square } from "@chessboard/types";

export type MakeMoveContext = {
  piece: Piece;
  target: Square;
  // state: Game;
  gameId: string;
};
export type CalcMove = {
  start: Square;
  pieces: Piece[];
  color: Color;
  adjacentOnly?: boolean;
};

export type MoveResult = {
  isBlackTurn: boolean;
  pieces: Piece[];
};
export type UserDto = {
  username: string;
  primaryEmail: string;
  password: string;
};

export type MoveRequest = {
  piece: Piece;
  target: Square;
  jwt: string;
  game: Game;
};
