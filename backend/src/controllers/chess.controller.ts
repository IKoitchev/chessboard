import { Board, Game } from "@chessboard/types";
import { Context } from "koa";
import Router, { RouterContext } from "koa-router";
import { generatePieces, initBoard } from "../utils/initBoard";
import { MakeMoveContext } from "dto";
import { Squares } from "../utils/squares";
import {
  getDiagonalMoves,
  getHorizontalAndVerticalMoves,
  getLMoves,
  getPawnMoves,
} from "../utils/moves";
import { makeMove } from "../utils/makeMove";
import { Guid } from "js-guid";

const routerOpts: Router.IRouterOptions = {
  prefix: "/chessboard",
};

const router: Router = new Router(routerOpts);

const games: Game[] = [];

router.get("/play/:gameId", async (ctx: RouterContext) => {
  const {
    params: { gameId },
  } = ctx;

  const game = games.find((g) => g.id === gameId);

  ctx.body = game;
});

router.post("/play", async (ctx: RouterContext) => {
  const newGame: Game = {
    id: String(new Guid()),
    pieces: generatePieces(),
    playerBlack: { id: "pb" },
    playerWhite: { id: "pw" },
    isBlackTurn: false,
  };

  games.push(newGame);
  console.log("number of games:", games.length);

  ctx.body = newGame;
});

router.get("/start", async (ctx: Context) => {
  const board: Board = initBoard();

  ctx.body = board;
});

router.post("/move", async (ctx: Context) => {
  const { piece, target, gameId } = ctx.request.body as MakeMoveContext;

  // console.log("id", gameId);
  // console.log("games", games);

  let game = games.find((g) => g.id === gameId);

  if (!game) {
    console.log("game not found");
    ctx.throw(400);
  }

  const result = makeMove(piece, target, game);

  games[games.findIndex((g) => g.id === gameId)] = { ...result };

  ctx.body = result;
});

router.get("/test", async (ctx: Context) => {
  const { piece, target, gameId } = ctx.request.body as MakeMoveContext;

  const board = initBoard();

  const pawn = board.pieces.find((p) => p.type === "Pawn" && p.file === "e");
  // const result = makeMove({
  //   piece: pawn,
  //   target: { file: "e", rank: "4" },
  //   state: board,
  // });

  // ctx.body = { pieces: result };
});

router.patch("/:movie_id", async (ctx: Context) => {
  ctx.body = "PATCH";
});

export default router;
