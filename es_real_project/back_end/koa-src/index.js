import Koa from "koa";
import Router from "koa-router";

import book from "./book";
import user from "./user";

const app = new Koa();
const router = new Router();

[book, user].forEach((router) => {
  // 路由分别写在不同的文件内
  app.use(router.routes());
  app.use(router.allowedMethods());
});

app.listen(3000, () => {
  console.log("koa server starting...");
});
