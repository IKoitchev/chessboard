export type Square = {
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

export type Game = {
  id: string;
  playerWhiteId: string;
  playerBlackId: string;
  pieces: Piece[];
  moves: Move[];
  result?: GameState;
};

export type GameState =
  | "draw"
  | "stalemate"
  | `${Color} in check`
  | `${Color} win`
  | null;

export type SquareContext = Square & {
  piece?: Piece;
};

export type Move = {
  id: string;
  targetFile: Column;
  targetRank: Row;
  piece: string;
  gameId: string;
};
export type UserInfo = {
  /**
   * The subject (end-user) identifier. This member is always present in a claims set.
   */
  sub: string;

  /**
   * The full name of the end-user, with optional language tag.
   */
  name: string;

  /**
   * The end-user's preferred email address.
   */
  email: string;
};

export type TokenResponse = {
  /**
   * The bearer access token to use for authenticating requests.
   */
  access_token: string;

  /**
   * How long until the access token expires in seconds from now.
   */
  expires_in?: number;

  /**
   * The OpenID ID token as a JWT.
   *
   * This field is only present on OpenID connect providers.
   */
  id_token?: string;

  /**
   * A refresh token for getting a new access token.
   */
  refresh_token?: string;

  token_type: "bearer";
};

export type WsMessage = {
  jwt: string;
};

export type MoveRequest = WsMessage & {
  piece: Piece;
  target: Square;
  game?: Game;
};

export type MoveResponse = Game;
