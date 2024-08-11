import { Context } from "koa";
import { decode, verify } from "jsonwebtoken";

const secret = process.env.SECRET ?? "secret";

export async function authorize(ctx: Context, next: () => Promise<any>) {
  const {
    headers: { authorization },
  } = ctx.request;

  if (!authorization) {
    ctx.throw(401, "Authorization header missing");
  }

  const token = authorization.replace(/Bearer /, "");

  const decoded = verify(token, secret);
  console.log(decoded);

  next();
}
