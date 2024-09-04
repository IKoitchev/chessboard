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
import { generatePieces } from "../utils/initBoard";

// Define a WebSocket middleware function
const moveRoutes: Middleware = (ctx) => {
  ctx.websocket.on("message", async (message) => {
    const {
      jwt,
      piece,
      target,
      game: gameObj,
    } = JSON.parse(String(message)) as MoveRequest;

    // practice game
    if (gameObj && piece && target) {
      const position: Game = getCurrentPosition(gameObj);

      if (!validTurnOrder(position, piece.color)) {
        const errorMsg = `It is not ${piece.color} player's turn!`;
        ctx.websocket.send(
          JSON.stringify({
            errorMsg,
            status: 400,
            pieces: position.pieces,
            moves: gameObj.moves,
          })
        );
        return;
      }

      const afterMove: Game = makeMove(piece, target, { ...position });

      const gameState = checkIfMateOrStalemate(
        afterMove.pieces,
        opposingColor(piece)
      );

      afterMove.result = gameState;
      ctx.websocket.send(JSON.stringify({ ...afterMove }));
      return;
    }

    // real game
    if ([jwt, piece, target].some((prop) => !prop)) {
      const errorMsg = "Validation failed";

      console.log(errorMsg, { jwt, piece, target });
      ctx.websocket.send(
        JSON.stringify({
          errorMsg,
          status: 400,
          pieces: generatePieces(),
          moves: [],
        })
      );
      return;
    }

    let token: JwtPayload;

    try {
      token = decodeJWT(jwt);
    } catch (error) {
      const errorMsg = "Unauthorized";
      console.error(errorMsg, error);
      ctx.websocket.send(
        JSON.stringify({ errorMsg, pieces: generatePieces() })
      );
      return;
    }

    const game = await GameModel.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { playerWhiteId: token.sub },
              { playerBlackId: token.sub },
            ],
          },
          {
            [Op.or]: [
              { result: { [Op.notLike]: "%win%" } },
              { result: { [Op.is]: null } },
            ],
          },
        ],
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
      ctx.websocket.send(
        JSON.stringify({ errorMsg, status: 400, pieces: position.pieces })
      );
      return;
    }

    const afterMove: Game = makeMove(piece, target, { ...position });

    const gameState = checkIfMateOrStalemate(
      afterMove.pieces,
      opposingColor(piece)
    );

    await GameModel.update(
      { result: gameState },
      { where: { id: game.id }, returning: true }
    );
    afterMove.result = gameState;
    // if (gameState) {
    // }

    if (afterMove.moves.length != game.moves.length) {
      await MoveModel.create({
        gameId: game.id,
        targetRank: target.rank,
        targetFile: target.file,
        piece: JSON.stringify(piece),
      });
    }

    console.log("afterMove", afterMove);
    ctx.websocket.send(JSON.stringify(afterMove));
  });

  ctx.websocket.on("close", () => {
    console.log("WebSocket connection closed");
  });
};

export default moveRoutes;
