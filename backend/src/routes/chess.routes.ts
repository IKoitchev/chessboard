import Router, { IRouterOptions } from "koa-router";
import {
  getGameHandler,
  makeMoveHandler,
} from "../controllers/chess.controller";
import { Context } from "koa";
import { authorize } from "../middleware/auth.middleware";
import { Game } from "../models";

const routerOpts: IRouterOptions = {
  prefix: "/chessboard",
};

const router: Router = new Router(routerOpts);

// router.post("/play", authorize, startGameHandler);

router.get("/play/:gameId?", authorize, getGameHandler);

// router.post("/move", makeMoveHandler);

router.get("/protected", authorize, async (ctx: Context) => {
  ctx.body = " Ur authed";
});

export default router;
