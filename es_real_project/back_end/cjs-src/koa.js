const Koa = require("koa");
const app = new Koa();

app.use(async (ctx, next) => {
  console.log("querying start 1");
  next();
  console.log("query end 1");
});

app.use(async (ctx, next) => {
  console.log("querying start 2");
  next();
  console.log("query end 2");
});

app.use(async (ctx, next) => {
  console.log("querying start 3");
  next();
  console.log("query end 3");
});

const main = (ctx) => {
  ctx.body = "hello world";
};

app.use(main);
app.listen(3000);
