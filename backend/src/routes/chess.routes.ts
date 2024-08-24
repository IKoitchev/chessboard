import Router, { IRouterOptions, RouterContext } from "koa-router";
import {
  getCurrentGameHandler,
  getPracticeGameHandler,
  makeMoveHandler,
} from "../controllers/chess.controller";
import { Context } from "koa";
import { authorize } from "../middleware/auth.middleware";
import { Piece, Game, Move, PieceType } from "@chessboard/types";
import { getCastleSquares } from "../utils/moves";
import { Knight, Rook } from "../types/Pieces";
import { Game as GameModel, Move as MoveModel } from "../models";

const routerOpts: IRouterOptions = {
  prefix: "/chessboard",
};

const router: Router = new Router(routerOpts);

router.get("/play", authorize, getCurrentGameHandler);

router.get("/castle", async (ctx: RouterContext) => {
  const king: Piece = {
    file: "e",
    rank: "1",
    color: "white",
    points: 1,
    type: "King",
  };
  const rookA: Piece = {
    file: "a",
    rank: "1",
    color: "white",
    points: 5,
    type: "Rook",
  };
  const rookH: Piece = {
    file: "h",
    rank: "1",
    color: "white",
    points: 5,
    type: "Rook",
  };
  const blackRook = new Rook({ file: "c", rank: "8" }, "black");
  const pieces: Piece[] = [king, rookA, rookH, blackRook];

  const game: Game = {
    id: "id",
    moves: [],
    pieces,
    playerBlackId: "1",
    playerWhiteId: "2",
  };

  const castle = getCastleSquares(game, king);

  ctx.body = castle;
});

router.get("/delete/:gameId?", async (ctx: RouterContext) => {
  const { gameId } = ctx.params;

  if (!gameId) {
    await GameModel.destroy({ truncate: true, cascade: true });
    return;
  }
  await GameModel.destroy({ where: { id: gameId } });

  ctx.status = 204;
});

router.get("/practice", getPracticeGameHandler);

export default router;
