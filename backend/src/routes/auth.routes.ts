import Router, { IRouterOptions } from "koa-router";
import {
  emailLoginHandler,
  emailRegisterHandler,
} from "../controllers/auth.controller";

const routerOpts: IRouterOptions = {
  prefix: "/auth",
};

const router: Router = new Router(routerOpts);

router.post("/email/login", emailLoginHandler);
router.post("/email/register", emailRegisterHandler);

// router.post("/logout", async (ctx: RouterContext) => {});

export default router;
