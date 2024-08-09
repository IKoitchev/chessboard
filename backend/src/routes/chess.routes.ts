import Router, { IRouterOptions } from "koa-router";
import {
  getGameHandler,
  makeMoveHandler,
  startGameHandler,
} from "../controllers/chess.controller";
import { Game as GameModel, Move as MoveModel } from "../models";
import { getCurrentPosition } from "../utils/moveUtils";
import { Context } from "koa";

const routerOpts: IRouterOptions = {
  prefix: "/chessboard",
};

const router: Router = new Router(routerOpts);

router.post("/play", startGameHandler);

router.get("/play/:gameId", getGameHandler);

router.post("/move", makeMoveHandler);

router.get("/test", async (ctx: Context) => {
  const id = "a184004c-4710-4cde-a029-28bbcf597848";

  const game = await GameModel.findByPk(id, { include: [MoveModel] });
  const { pieces } = getCurrentPosition(game);

  ctx.body = {};
});

export default router;
