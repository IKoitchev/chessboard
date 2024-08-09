import { Game } from "@chessboard/types";
import { Context } from "koa";
import Router, { RouterContext } from "koa-router";
import { generatePieces } from "../utils/initBoard";
import { MakeMoveContext } from "src/dto";
import { makeMove } from "../utils/makeMove";
import { Game as GameModel } from "../models/game";
import { Move as MoveModel } from "../models/move";
import {
  checkIfMateOrStalemate,
  getCurrentPosition,
  opposingColor,
} from "../utils/moveUtils";

export async function getGameHandler(ctx: RouterContext) {
  const {
    params: { gameId },
  } = ctx;

  const game = await GameModel.findOne({
    where: { id: gameId, result: null },
    include: [MoveModel],
  });

  const position: Game = getCurrentPosition(game);

  ctx.body = { ...position };
}

// router.get("/play/:gameId", getGameHandler);

export async function startGameHandler(ctx: RouterContext) {
  // Add metadata such as player names, passed from the context
  const newGame = await GameModel.create({
    playerBlackId: "black",
    playerWhiteId: "white",
  });

  const initialPieces = generatePieces();

  ctx.body = { ...newGame.dataValues, pieces: initialPieces };
}

export async function makeMoveHandler(ctx: Context) {
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
    console.error(errMsg);
    ctx.throw(400, errMsg);
  }

  const afterMove: Game = makeMove(piece, target, { ...position });

  const gameState = checkIfMateOrStalemate(
    afterMove.pieces,
    opposingColor(piece)
  );

  console.log(gameState ?? "ongoing");

  if (gameState) {
    await GameModel.update(
      { result: gameState },
      { where: { id: gameId }, returning: true }
    );
    afterMove.result = gameState;
  }

  if (afterMove.moves.length != game.moves.length) {
    await MoveModel.create({
      gameId,
      targetRank: target.rank,
      targetFile: target.file,
      piece: JSON.stringify(piece),
    });
  }

  // console.log(afterMove.result);
  ctx.body = afterMove;
}
