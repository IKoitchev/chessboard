import { Board, Game, Move, Piece } from "@chessboard/types";
import { Context } from "koa";
import Router, { RouterContext } from "koa-router";
import { generatePieces, initBoard } from "../utils/initBoard";
import { MakeMoveContext } from "src/dto";
import { Squares } from "../utils/squares";
import {
  getDiagonalMoves,
  getHorizontalAndVerticalMoves,
  getLMoves,
  getPawnMoves,
} from "../utils/moves";
import { makeMove } from "../utils/makeMove";
import { Guid } from "js-guid";
import * as path from "path";
import sequelize from "../utils/sqlite";
import { Game as GameModel } from "../models/game";
import { Move as MoveModel } from "../models/move";
import { getCurrentPosition } from "../utils/moveUtils";

const routerOpts: Router.IRouterOptions = {
  prefix: "/chessboard",
};

const router: Router = new Router(routerOpts);
const a = "unused";
router.get("/play/:gameId", async (ctx: RouterContext) => {
  const {
    params: { gameId },
  } = ctx;

  const game = await GameModel.findOne({
    where: { id: gameId, result: null },
    include: [MoveModel],
  });

  const position: Game = getCurrentPosition(game);

  ctx.body = { ...position };
});

router.post("/play", async (ctx: RouterContext) => {
  // Add metadata such as player names, passed from the context
  const newGame = await GameModel.create({
    playerBlackId: "black",
    playerWhiteId: "white",
  });

  const initialPieces = generatePieces();

  ctx.body = { ...newGame.dataValues, pieces: initialPieces };
});

router.post("/move", async (ctx: Context) => {
  const { piece, target, gameId } = ctx.request.body as MakeMoveContext;

  // Find the game
  const game = await GameModel.findByPk(gameId, {
    include: [MoveModel],
  });

  if (!game) {
    console.log("Game not found");
    ctx.throw(400);
  }

  // TO-DO:
  // Game model has no pieces but is required
  const position: Game = getCurrentPosition(game);

  // Checks whether the piece color matches the player who has the turn
  // TO-DO: remove turn tracking from GameModel
  if ((game.moves.length % 2 === 0) !== (piece.color === "white")) {
    const errMsg = `It is not ${piece.color} player's turn!`;
    console.log(errMsg);
    ctx.throw(400, errMsg);
  }

  const afterMove: Game = makeMove(piece, target, { ...position });

  if (afterMove.moves.length != game.moves.length) {
    console.log("making turn");
    await MoveModel.create({
      gameId,
      targetRank: target.rank,
      targetFile: target.file,
      piece: JSON.stringify(piece),
    });
  }

  ctx.body = afterMove;
});

router.get("/test", async (ctx: Context) => {
  const id = "a184004c-4710-4cde-a029-28bbcf597848";

  const game = await GameModel.findByPk(id, { include: [MoveModel] });
  const { pieces } = getCurrentPosition(game);

  ctx.body = {};
});

router.patch("/:movie_id", async (ctx: Context) => {
  ctx.body = "PATCH";
});

export default router;
