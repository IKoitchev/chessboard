import Router, { IRouterOptions } from "koa-router";
import {
  getGameHandler,
  makeMoveHandler,
  startGameHandler,
} from "../controllers/chess.controller";
import { Game as GameModel, Move as MoveModel } from "../models";
import { getCurrentPosition } from "../utils/moveUtils";
import { Context } from "koa";
import { authorize } from "../middleware/auth.middleware";

const routerOpts: IRouterOptions = {
  prefix: "/chessboard",
};

const router: Router = new Router(routerOpts);

router.post("/play", startGameHandler);

router.get("/play/:gameId", getGameHandler);

router.post("/move", makeMoveHandler);

router.get("/protected", authorize, async (ctx: Context) => {
  ctx.body = " Ur authed";
});

export default router;
