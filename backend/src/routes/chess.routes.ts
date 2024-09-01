import Router, { IRouterOptions, RouterContext } from "koa-router";
import {
  getCurrentGameHandler,
  getPracticeGameHandler,
  makeMoveHandler,
  startGameHandler,
} from "../controllers/chess.controller";
import { authorize } from "../middleware/auth.middleware";
import { Game as GameModel, Move as MoveModel } from "../models";

const routerOpts: IRouterOptions = {
  prefix: "/chessboard",
};

const router: Router = new Router(routerOpts);

router.get("/play", authorize, getCurrentGameHandler);

router.get("/start", authorize, startGameHandler);

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
