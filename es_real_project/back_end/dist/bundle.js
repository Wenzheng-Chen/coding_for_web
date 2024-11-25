(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('core-js/modules/esnext.async-iterator.for-each.js'), require('core-js/modules/esnext.iterator.constructor.js'), require('core-js/modules/esnext.iterator.for-each.js'), require('koa'), require('koa-router'), require('koa-bodyparser'), require('core-js/modules/esnext.async-iterator.reduce.js'), require('core-js/modules/esnext.iterator.reduce.js')) :
  typeof define === 'function' && define.amd ? define(['core-js/modules/esnext.async-iterator.for-each.js', 'core-js/modules/esnext.iterator.constructor.js', 'core-js/modules/esnext.iterator.for-each.js', 'koa', 'koa-router', 'koa-bodyparser', 'core-js/modules/esnext.async-iterator.reduce.js', 'core-js/modules/esnext.iterator.reduce.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(null, null, null, global.Koa, global.Router, global.bodyParser));
})(this, (function (esnext_asyncIterator_forEach_js, esnext_iterator_constructor_js, esnext_iterator_forEach_js, Koa, Router, bodyParser) { 'use strict';

  const RequestMethod = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
    OPTION: "option",
    PATCH: "patch"
  };
  const controllers = [];

  // 装饰器的本质对类的行为的改变，在代码编译时发生的，而不是运行时
  // 编译器执行的函数
  function Controlller(prefix = "") {
    return function (target) {
      // 给Controller添加路由的前缀
      console.log("给Controller添加路由的前缀", target);
      target.prefix = prefix;
    };
  }

  // 两个参数 method
  function RequestMapping(method = "", url = "") {
    return function (target, name, descriptor) {
      let path = url || `/${name}`; // 如果没有定义url，就以函数的名称，作为接口段
      controllers.push({
        url: path,
        method: method,
        handler: target[name],
        constructor: target.constructor
      });
    };
  }

  var _dec, _dec2, _dec3, _class, _class2;
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  let BookController = (_dec = Controlller("/book"), _dec2 = RequestMapping(RequestMethod.GET, "/all"), _dec3 = RequestMapping(RequestMethod.GET, "/del"), _dec(_class = (_class2 = class BookController {
    async getAllBooks(ctx, next) {}
    async deleteBook(ctx, next) {
      ctx.body = [{
        name: "JS Learning",
        price: 1000
      }];
    }
  }, _applyDecoratedDescriptor(_class2.prototype, "getAllBooks", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "getAllBooks"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteBook", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteBook"), _class2.prototype), _class2)) || _class);

  var index = {
    Book: BookController
  };

  const app = new Koa();
  const router = new Router();
  app.use(bodyParser());
  console.log("constrollers", controllers);
  controllers.forEach(item => {
    let {
      url,
      method,
      handler,
      constructor
    } = item;
    const {
      prefix
    } = constructor;
    if (prefix) url = `${prefix}${url}`;
    router[method](url, handler);
  });
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(3000, () => {
    console.log("koa server starting...");
  });

}));
