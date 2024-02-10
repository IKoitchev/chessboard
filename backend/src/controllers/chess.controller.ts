import { Board } from "@chessboard/types";
import { Context } from "koa";
import Router from "koa-router";
import { initBoard } from "../utils/initBoard";
import { MakeMoveContext } from "dto";
import { Squares } from "../utils/squares";
import {
  getDiagonalMoves,
  getHorizontalAndVerticalMoves,
} from "../utils/moves";

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

  const board: Board = initBoard();

  const pc = board.pieces.find((p) => p.type === "Rook");

  getHorizontalAndVerticalMoves(
    { file: pc.file, rank: pc.rank },
    board.pieces,
    pc.color
  );

  ctx.body = "POST";
});

router.get("/test", async (ctx: Context) => {
  const { piece, target, state } = ctx.request.body as MakeMoveContext;

  const board: Board = initBoard();

  // const pc = board.pieces.find((p) => p.type === "Pawn");

  // getHorizontalAndVerticalMoves(
  //   { file: "a", rank: "2" },
  //   board.pieces,
  //   "white"
  // );
  getDiagonalMoves({ file: "a", rank: "2" }, board.pieces, "white");

  ctx.body = "POST";
});

router.patch("/:movie_id", async (ctx: Context) => {
  ctx.body = "PATCH";
});

export default router;
