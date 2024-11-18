// 柯里化：柯里化是指把多元参数的函数拆分成多个单元函数的过程。
// 柯里化后的函数不会立即求值，而是返回一个函数，接收下一个参数，直到所有参数被传入为止（限定参数个数的，如果没有限定参数个数，可能需要主动调用，方法不一，可以使用toString）
// 柯里化的优点：参数复用，延迟执行，提到代码的可读性和可测试性

// 面试题1: 实现一个add方法, 使计算结果能够满足以下预期

// addCurried(1)(2)(3) = 6
// addCurried(1,2,3)(4) = 10
// addCurried(1)(2)(3)(4)(5) = 15
function addCurried() {
  const args = Array.prototype.slice.call(arguments);
  const curried = function () {
    if (arguments.length === 0) {
      return args.reduce((prev, cur) => prev + cur, 0);
    }
    args.push(...arguments);
    return curried;
  };
  return curried;
}

// 面试题2:写一个通用的carry函数（参数确定或者参数不确定）

// 写法1
function staticCurry_0(fn) {
  const args = [];
  const length = fn.length;
  const curried = function () {
    args.push(...arguments);
    if (args.length === length) {
      return fn(...args);
    } else {
      return curried;
    }
  };
  return curried;
}

// 写法2
function staticCurry_1(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return (...nextArgs) => curried(...args, ...nextArgs);
    }
  };
}

function dynamicCurry(fn) {
  const args = [];
  const curried = function (...nextArgs) {
    if (nextArgs.length === 0) {
      return fn(...args, ...nextArgs);
    }
    args.push(...nextArgs);
    return curried;
  };
  return curried;
}

// compose 实现

// 单参数
function basicCompose(...fns) {
  return function (initialValue) {
    return fns.reduceRight((pre, fn) => fn(pre), initialValue);
  };
}

// 多参数
function multiCompose(...fns) {
  return function (...args) {
    return fns.reduceRight((pre, fn) => [fn(...pre)], args)[0];
  };
}

// 支持异步操作

function asyncCompose(...fns) {
  return function (...args) {
    return fns.reduceRight(
      (pre, fn) => {
        return pre instanceof Promise
          ? pre.then((res) => fn(res))
          : Promise.resolve(fn(pre));
      },
      args.length > 1 ? fns.pop()(...args) : args[0]
    );
  };
}
