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
  type Player = {
    id: string;
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
