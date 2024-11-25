import Router from "koa-router";
const router = new Router();

router.get("/book", async (ctx, next) => {
  ctx.body = "Book";
});

export default router;
