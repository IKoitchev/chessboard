import { Sequelize } from "sequelize-typescript";
import { describe, expect, it } from "vitest";

import { createJWTResponse, decodeJWT } from "./jwt";
import { JwtPayload } from "jsonwebtoken";

let sequelize: Sequelize;

describe("JWT", () => {
  it("should create jwt response", () => {
    const expires = 1234;
    const jwt = createJWTResponse("sub", { expires });

    expect(jwt.expires_in).toBe(expires);
    expect(jwt.token_type).toBe("bearer");
    expect(jwt.access_token).toBeTypeOf("string");
    expect(jwt.refresh_token).toBeTypeOf("string");
  });

  it("should decode JWT return its contents", () => {
    const { access_token } = createJWTResponse("sub", { expires: 10 });

    const payload = decodeJWT(access_token);

    expect(payload).toHaveProperty("aud");
    expect(payload).toHaveProperty("iat");
    expect(payload).toHaveProperty("iss");
    expect(payload).toHaveProperty("sub");
    expect(payload).toHaveProperty("exp");
  });
});
