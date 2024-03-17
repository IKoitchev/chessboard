import Koa from "koa";
import * as HttpStatus from "http-status-codes";
import movieController from "./controllers/chess.controller";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import * as path from "path";
import sequelize from "./utils/sqlite";
import { Game } from "./models/game";

const app: Koa = new Koa();

// Generic error handling middleware.
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status =
      error.statusCode ||
      error.status ||
      HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit("error", error, ctx);
  }
});

sequelize.sync();

// sequelize.sync({ alter: true });

app.use(cors());
app.use(logger());
app.use(bodyParser());
app.use(movieController.routes());
app.use(movieController.allowedMethods());

// Application error logging.
app.on("error", console.error);

export default app;
