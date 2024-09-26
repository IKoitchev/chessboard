import { RawData } from "ws";
import { Game } from "@chessboard/types";
import { MiddlewareContext } from "koa-websocket";
import { DefaultContext, DefaultState } from "koa";
// import { MoveRequest } from "src/dto";
import {
  checkIfMateOrStalemate,
  getCurrentPosition,
  opposingColor,
  validTurnOrder,
} from "../utils/moveUtils";
import { makeMove } from "../utils/makeMove";
import { generatePieces } from "../utils/initBoard";
import { JwtPayload } from "jsonwebtoken";
import { decodeJWT } from "../utils/auth/jwt";
import {
  Game as GameModel,
  User as UserModel,
  Move as MoveModel,
} from "../models";
import { Op } from "sequelize";
import { MoveRequest } from "../dto";

export async function MovesHandler(
  message: RawData,
  ctx: MiddlewareContext<DefaultState> & DefaultContext
) {
  const {
    jwt,
    piece,
    target,
    game: gameObj,
    promoteTo,
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

    const afterMove: Game = makeMove(piece, target, { ...position }, promoteTo);

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
    ctx.websocket.send(JSON.stringify({ errorMsg, pieces: generatePieces() }));
    return;
  }

  const game = await GameModel.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [{ playerWhiteId: token.sub }, { playerBlackId: token.sub }],
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

  const afterMove: Game = makeMove(piece, target, { ...position }, promoteTo);

  const gameState = checkIfMateOrStalemate(
    afterMove.pieces,
    opposingColor(piece)
  );

  await GameModel.update(
    { result: gameState },
    { where: { id: game.id }, returning: true }
  );
  afterMove.result = gameState;

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
}
