export const RequestMethod = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  OPTION: "option",
  PATCH: "patch",
};

export const controllers = [];

// 装饰器的本质对类的行为的改变，在代码编译时发生的，而不是运行时
// 编译器执行的函数
export function Controlller(prefix = "") {
  return function (target) {
    // 给Controller添加路由的前缀
    console.log("给Controller添加路由的前缀", target);
    target.prefix = prefix;
  };
}

// 两个参数 method
export function RequestMapping(method = "", url = "") {
  return function (target, name, descriptor) {
    let path = url || `/${name}`; // 如果没有定义url，就以函数的名称，作为接口段
    controllers.push({
      url: path,
      method: method,
      handler: target[name],
      constructor: target.constructor,
    });
  };
}
