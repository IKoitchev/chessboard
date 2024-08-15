import Router, { IRouterOptions } from "koa-router";

import { Middleware } from "koa-websocket";
import { MoveRequest } from "../dto";
import { decodeJWT } from "../utils/auth/jwt";
import {
  Game as GameModel,
  Move as MoveModel,
  User as UserModel,
} from "../models";
import { Op } from "sequelize";
import { Game } from "@chessboard/types";
import {
  checkIfMateOrStalemate,
  getCurrentPosition,
  opposingColor,
  validTurnOrder,
} from "../utils/moveUtils";
import { makeMove } from "../utils/makeMove";
import { JwtPayload } from "jsonwebtoken";

// Define a WebSocket middleware function
const moveRoutes: Middleware = (ctx) => {
  ctx.websocket.on("message", async (message) => {
    const { jwt, piece, target } = JSON.parse(String(message)) as MoveRequest;

    // ctx.websocket.send("countermessage");

    if ([jwt, piece, target].some((prop) => !prop)) {
      console.log("Validation failed", { jwt, piece, target });
      ctx.websocket.send("Validation failed");
      return;
    }

    let token: JwtPayload;

    try {
      token = decodeJWT(jwt);
    } catch (error) {
      const errorMsg = "Unauthorized";
      console.error(errorMsg);
      ctx.websocket.send(errorMsg);
      return;
    }

    const game = await GameModel.findOne({
      where: {
        [Op.or]: [{ playerWhiteId: token.sub }, { playerBlackId: token.sub }],
        result: null,
      },
      include: [
        { model: UserModel, as: "playerWhite" },
        { model: UserModel, as: "playerBlack" },
        MoveModel,
      ],
    });

    if (!game) {
      const errorMsg = "User has no active game!";
      console.error(errorMsg);
      ctx.websocket.send(errorMsg);
    }

    const position: Game = getCurrentPosition(game);

    if (!validTurnOrder(position, piece.color, token.sub)) {
      const errorMsg = `It is not ${piece.color} player's turn!`;
      ctx.websocket.send(JSON.stringify({ errorMsg, status: 400 }));
      return;
    }

    const afterMove: Game = makeMove(piece, target, { ...position });

    const gameState = checkIfMateOrStalemate(
      afterMove.pieces,
      opposingColor(piece)
    );

    if (gameState) {
      await GameModel.update(
        { result: gameState },
        { where: { id: game.id }, returning: true }
      );
      afterMove.result = gameState;
    }

    if (afterMove.moves.length != game.moves.length) {
      await MoveModel.create({
        gameId: game.id,
        targetRank: target.rank,
        targetFile: target.file,
        piece: JSON.stringify(piece),
      });
    }

    console.log(afterMove);
    ctx.websocket.send(JSON.stringify(afterMove));
  });

  ctx.websocket.on("close", () => {
    console.log("WebSocket connection closed");
  });
};

export default moveRoutes;
