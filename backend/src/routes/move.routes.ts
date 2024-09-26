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
import { MovesHandler } from "../controllers/moves.handler";

// Define a WebSocket middleware function
const moveRoutes: Middleware = (ctx) => {
  ctx.websocket.on("message", async (message) => MovesHandler(message, ctx));
  ctx.websocket.on("close", () => {
    console.log("WebSocket connection closed");
  });
};

export default moveRoutes;
