import { Context } from "koa";

import * as HttpStatus from "http-status-codes";

export async function ErrorHandling(ctx: Context, next: () => Promise<any>) {
  try {
    await next();
  } catch (error) {
    ctx.status =
      error.statusCode ||
      error.status ||
      HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    console.error(error);
    ctx.body = { error };
    ctx.app.emit("error", error, ctx);
  }
}
