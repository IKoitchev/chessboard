import { Sequelize } from "sequelize-typescript";
import { User } from "../models";
import { expect, describe, it, beforeAll, afterAll } from "vitest";
import path from "path";
import { closeTestApp, request, setTestApp } from "axios-test-instance";
import app from "../app";
import { UserDto } from "../dto";

let sequelize: Sequelize;

describe("Auth", () => {
  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: `${path.join(
        path.resolve(),
        "src",
        "utils",
        "db",
        "chessdb.test.sqlite"
      )}`,
      logging: false,
      models: [User],
    });

    await sequelize.sync({ alter: true });

    await setTestApp(app);
  });
  describe("Register", () => {
    it("should create a user", async () => {
      const body: UserDto = {
        password: "password",
        primaryEmail: "primaryEmail",
        username: "username",
      };

      await request.post("/auth/email/register", body);

      const user = await User.findOne({
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        where: { primaryEmail: body.primaryEmail, username: body.username },
      });

      expect(user.dataValues).toStrictEqual({
        id: user.id,
        primaryEmail: body.primaryEmail,
        username: body.username,
      });
    });
  });
  afterAll(() => {
    sequelize.truncate();
    closeTestApp();
  });
});
