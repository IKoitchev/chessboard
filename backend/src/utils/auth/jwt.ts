import { JWTOptions, TokenResponse } from "@chessboard/types";
import { decode, sign, verify } from "jsonwebtoken";

const secret = process.env.SECRET ?? "secret";
const host = process.env.HOST ?? "http://localhost:3000";

export function createJWTResponse(
  sub: string,
  { aud = host, expires = 3600, refreshToken = true, scope }: JWTOptions
): TokenResponse {
  const iat = Math.floor(Date.now() / 1000);
  const payload = {
    // The audience this token is for, i.e. the web platform host or an OAuth2 client id.
    aud,
    // This token is issued at the current time.
    iat,
    // This token was issued by the Appsemble host.
    iss: aud,
    scope,
    // This token can be used to authenticate the user having this id.
    sub,
  };

  // console.log(payload, iat, expires);
  const response: TokenResponse = {
    // The access token token expires in an hour.
    access_token: sign({ ...payload, exp: iat + expires }, secret),
    expires_in: expires,
    token_type: "bearer",
  };
  // console.log(response);

  if (refreshToken) {
    // The refresh token token expires in a month.
    response.refresh_token = sign(
      { ...payload, exp: iat + 60 * 60 * 24 * 30 },
      secret
    );
  }

  return response;
}

export function decodeJWT(token: string) {
  const decoded = verify(token, secret);

  console.log(decoded);
  console.log(typeof decoded);
  return decoded;
}
