const koa = require("koa");
const Router = require("koa-router");

const app = new koa();
const router = new Router();

router.get("/api", (ctx, next) => {
  ctx.type = "application/json";
  ctx.body = { data: "Hello Hero" };
});

app.use(router.routes());
app.use(router.allowedMethods({}));

app.listen(3000, () => {
  console.log("koa server starting...");
});
