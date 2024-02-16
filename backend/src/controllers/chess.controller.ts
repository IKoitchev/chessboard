import { Board } from "@chessboard/types";
import { Context } from "koa";
import Router from "koa-router";
import { initBoard } from "../utils/initBoard";
import { MakeMoveContext } from "dto";
import { Squares } from "../utils/squares";
import {
  getDiagonalMoves,
  getHorizontalAndVerticalMoves,
  getLMoves,
  getPawnMoves,
} from "../utils/moves";
import { makeMove } from "../utils/makeMove";

const routerOpts: Router.IRouterOptions = {
  prefix: "/chessboard",
};

const router: Router = new Router(routerOpts);

router.get("/", async (ctx: Context) => {
  ctx.body = "GET ALL";
});

router.get("/start", async (ctx: Context) => {
  const board: Board = initBoard();

  ctx.body = board;
});

router.post("/move", async (ctx: Context) => {
  const { piece, target, state } = ctx.request.body as MakeMoveContext;

  const result = makeMove({ piece, target, state });

  // console.log("piece", piece);
  // console.log("target", target);
  // console.log("state", state);
  // console.log("result", result);
  console.log(result[32]);
  ctx.body = result;
});

router.get("/test", async (ctx: Context) => {
  const { piece, target, state } = ctx.request.body as MakeMoveContext;

  const board = initBoard();

  const pawn = board.pieces.find((p) => p.type === "Pawn" && p.file === "e");
  const result = makeMove({
    piece: pawn,
    target: { file: "e", rank: "4" },
    state: board,
  });

  ctx.body = { pieces: result };
});

router.patch("/:movie_id", async (ctx: Context) => {
  ctx.body = "PATCH";
});

export default router;
