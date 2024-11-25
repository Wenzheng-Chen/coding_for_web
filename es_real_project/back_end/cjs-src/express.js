const express = require("express");
// node端，有一个http模块(基于net模块(eventEmitter/stream))
// express 是一个后端框架
// 洋葱模型？
// nodemon 可以实时修改


//Vite 1 koa Vite 2 connect
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  console.log("Querying Start 1");
  next();
  console.log("Querying End 1");
});

app.use((req, res, next) => {
  console.log("Querying Start 2");
  next();
  console.log("Querying End 2");
});

app.use((req, res, next) => {
  console.log("Querying Start 3");
  next();
  console.log("Querying End 3");
});

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`Example listening on Port ${PORT}`);
});


// koa 也是一个后端框架，是由express原班人马打造，主要是轻量，插件分了出去