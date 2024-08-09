import { Context } from "koa";
import { decode, verify } from "jsonwebtoken";

const secret = process.env.SECRET ?? "secret";

export async function authorize(ctx: Context, next: () => Promise<any>) {
  const { headers } = ctx.request;
  const token = headers.authorization;

  if (!token) {
    ctx.throw(401, "Authorization header missing");
  }

  const decoded = verify(token, secret);
  console.log(decoded);

  next();
}
