declare module "@chessboard/types" {
  type Board = {
    pieces: Piece[];
  };

  type Square = {
    rank: Rank;
    file: File;
    piece?: Piece;
  };

  type Color = "black" | "white";

  type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

  type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

  type Piece = {
    rank: Rank;
    file: File;
    color: Color;
    points: number;
    type: PieceType;
  };
  type PieceType = "Pawn" | "King" | "Bishop" | "Queen" | "Knight" | "Rook";

  type Game = {
    id: string;
    playerWhiteId: string;
    playerBlackId: string;
    pieces: Piece[];
    moves: Move[];
    result?: GameState;
  };
  type User = {
    id: string;
    primaryEmail: string;
    username: string;
    password: string;
    currentGame: Game;
    blackGames: Game[];
    whiteGames: Game[];
  };
  type Move = {
    id: string;
    targetFile: File;
    targetRank: Rank;
    piece: string;
    gameId: string;
  };
  type GameState =
    | "draw"
    | "stalemate"
    | `${Color} in check`
    | `${Color} win`
    | null;
}

export type JWTOptions = {
  aud?: string;
  expires?: number;
  refreshToken?: boolean;
  scope?: string;
};

export interface TokenResponse {
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
}
