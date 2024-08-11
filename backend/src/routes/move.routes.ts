import Router, { IRouterOptions } from "koa-router";

import { Middleware } from "koa-websocket";
import { MoveRequest } from "../dto";
import { decodeJWT } from "../utils/auth/jwt";
import { Game, User } from "../models";
import { Op } from "sequelize";

// Define a WebSocket middleware function
const moveRoutes: Middleware = (ctx) => {
  ctx.websocket.on("message", async (message) => {
    const { jwt, piece, target } = JSON.parse(String(message)) as MoveRequest;

    if ([jwt, piece, target].some((prop) => !prop)) {
      console.log("Validation failed", { jwt, piece, target });
      ctx.websocket.send("Validation failed");
    }

    const token = decodeJWT(jwt);

    const game = await Game.findOne({
      where: {
        [Op.or]: [{ playerWhiteId: token.sub }, { playerBlackId: token.sub }],
        result: null,
      },
      include: [User],
    });

    console.log("Received message:", message);
    ctx.websocket.send(`Echo: ${message}`);
  });

  ctx.websocket.on("close", () => {
    console.log("WebSocket connection closed");
  });
};

export default moveRoutes;
