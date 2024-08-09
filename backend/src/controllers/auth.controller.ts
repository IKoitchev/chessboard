import Router, { RouterContext } from "koa-router";
import { UserDto } from "../dto";
import { isValidEmail } from "../utils/auth/email";
import { compareSync, hashSync } from "bcrypt";
import { User } from "../models";
import { createJWTResponse } from "../utils/auth/jwt";

export async function emailLoginHandler(ctx: RouterContext) {
  const { primaryEmail, password } = ctx.request.body as UserDto;

  let user: User;
  try {
    user = await User.findOne({
      where: { primaryEmail },
    });
  } catch (error: unknown) {
    console.log(error);
    // TO-DO: Return 400 if validation error

    ctx.throw(500);
  }
  if (!user) {
    ctx.throw(400, "Invalid email or password");
  }

  if (!compareSync(password, user.password)) {
    ctx.throw(400, "Invalid email or password");
  }

  ctx.body = createJWTResponse(user.id, {});
}

export async function emailRegisterHandler(ctx: RouterContext) {
  const { primaryEmail, password, username } = ctx.request.body as UserDto;

  // Validate email
  if (!isValidEmail(primaryEmail)) {
    ctx.throw(400, "Invalid email");
  }
  const hash = hashSync(password, 10);

  try {
    const user = await User.create({ primaryEmail, username, password: hash });
    ctx.body = createJWTResponse(user.id, {});
  } catch (error: unknown) {
    console.log(error);
    // TO-DO: Return 400 if validation error

    ctx.throw(500, "Something went wrong");
  }
}
