import { Game } from "@chessboard/types";
import { RouterContext } from "koa-router";
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
import { JwtPayload } from "jsonwebtoken";
import { Op } from "sequelize";

export async function getGameHandler(ctx: RouterContext) {
  const {
    params: { gameId },
  } = ctx;

  const { sub } = ctx.state.tokenInfo as JwtPayload;

  // Find the existing one by gameId
  if (gameId) {
    const game = await GameModel.findOne({
      where: {
        id: gameId,
        result: {
          [Op.notLike]: "%win%",
        },
      },
      include: [MoveModel],
    });

    if (!game) {
      ctx.throw(400, "no game found with this id");
    }
    const position: Game = getCurrentPosition(game);

    ctx.body = { ...position };
    return;
  }

  // Find it as the user's current game

  const game = await GameModel.findOne({
    where: {
      [Op.or]: [{ playerWhiteId: sub }, { playerBlackId: sub }],
      result: null,
    },
    include: [MoveModel],
  });

  if (!game) {
    const isWhite = true;

    const args = isWhite
      ? {
          playerBlackId: "7ba3adb3-961d-4bc1-9308-8b4fb2a1431d",
          playerWhiteId: sub,
        }
      : {
          playerBlackId: sub,
          playerWhiteId: "7ba3adb3-961d-4bc1-9308-8b4fb2a1431d",
        };

    try {
      const newGame = await GameModel.create(args);

      const initialPieces = generatePieces();

      ctx.body = { ...newGame.dataValues, pieces: initialPieces };
    } catch (error) {
      console.error(error);
      ctx.throw(500);
    }
  } else {
    const position: Game = getCurrentPosition(game);

    if (game) {
      ctx.body = { ...position };
      // return;
    }
  }
}

export async function makeMoveHandler(ctx: RouterContext) {
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
    ctx.status = 400;
    ctx.body = errMsg;
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

  ctx.body = afterMove;
}
