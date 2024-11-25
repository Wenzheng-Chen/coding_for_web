import Router from "koa-router";
const router = new Router();

router.get("/user", async (ctx, next) => {
  ctx.body = "User";
});

export default router;
