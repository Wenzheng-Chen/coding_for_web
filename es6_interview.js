// ******************面试题1: void 0是什么意思******************
{
  // void是JavaScript中的一个运算符，接收一个参数并返回undefined，有些情况下undefined有可能被重写，所以可以借助void 0获得一个纯净的undefined
}
// ******************面试题2: new一个箭头函数会发生什么******************
{
  // 首先，new操作符的过程如下
  // 1. 创建一个简单的对象{}
  // 2. 将创建的该对象的__proto__指向构造函数的原型对象prototype
  // 3. 将创建的该对象作为this的上下文
  // 4. 如果该函数没有返回值，返回this
  // 由于箭头函数没有prototype，也没有自己的this，其this继承它的外层函数（代码位置），更没有arguments，无法完成上述过程中的2，3，所以会失败。
  // 从babel角度讲，babel会把this转成void 0;
  // 会报错：function is not a constructor,  从babel角度讲，babel会把this转成void 0;
  // 箭头函数没有 [[Construct]] 内部方法
  // 箭头函数的this是由它的定义位置决定的，而非调用位置（this是词法作用域绑定的），构造函数需要创建一个新的this对象，但箭头函数不能
  // 箭头函数没有自己的 this，它会“继承”定义它的外层函数（或作用域）的 this
}
// ******************面试题3: 哪些场景不能用箭头函数******************
{
  // 箭头函数没有自己的this，它的this始终继承自定义时的外层作用域，它没有arguments对象，没有prototype
  // 基于这些特性，箭头函数无法作为构造函数（没有prototype），箭头函数中不能使用arguments(可以使用...args)
  // 动态this绑定的场景可能有问题
  const obj = {
    value: 10,
    method: () => {
      console.log(this.value); // this 指向window/global/undefined
    },
  };
  obj.method();
  // DOM事件回调中需要this的场景
  const button = document.querySelector("button");
  button.addEventListener("click", () => {
    console.log(this); // undefined
  });
  // 普通函数this指向button（绑定的元素），如果想用箭头函数，需要使用event.target
}
// ******************面试题4: arguments / callee / caller的区别******************
{
  // arguments 是一个类数组对象，包含传入函数的全部参数
  // callee是arguments的一个属性，指向当前正在执行的函数
  // caller是function对象的属性，用于返回调用当前函数的函数
}
// ******************面试题5: 如何拿到所有的参数******************
{
  // 使用arguments或者...rest
  // arguments是类数组结构对象，箭头函数不适用，...rest是真正数组，普通和箭头函数都适用
}
// ******************面试题7: Object.assign是深拷贝还是浅拷贝（多层）******************
{
  // 延伸：扩展运算符(...)数组或者对象中的每一个值都会被拷贝到一个新的数组和对象中，它不复制继承的属性或类的属性，但是会复制Symbol
  let dist = {
    foo: "foo",
  };
  let bar = {
    bar: { bar: "bar" },
  };
  let baz = {
    baz: "baz",
  };
  res.baz = "baz new";
  console.log(baz); //  {baz: 'baz'} 第一层是深拷贝
  res.bar.bar = "bar new";
  console.log(bar); // {bar: {bar: "bar new"}} // 深层的是浅拷贝
}
// ******************面试题8: 如何实现一个断言函数  ******************
{
  const teacher = {
    name: "king",
  };
  const assert = new Proxy(
    {},
    {
      set: (target, propKey, value) => {
        if (!value) {
          console.log(`Error ${propKey}`);
          return false;
        }
        return true;
      },
    }
  );
  assert["Teacher's name is king"] = teacher.name === "king";
  assert["Teacher's name is queen"] = teacher.name === "queen";
}
// ******************面试题9: JS 有哪些迭代器，该如何使用  ******************
{
  // Array, Map, Set, String, TypedArray, arguments, Nodelist
  // Array Iterator
  const arr = [1, 2];
  for (const item of arr) {
    console.log(item);
  }
  const arrIterator = arr[Symbol.iterator]();
  console.log(arrIterator.next()); // {value: 1, done: false}
  console.log(arrIterator.next()); // {value: 2, done: false}
  console.log(arrIterator.next()); // {value: undefined, done: true}
  console.log(arrIterator.next()); // {value: undefined, done: true}

  // String Iterator
  const str = "he";
  for (const ele of str) {
    console.log(ele);
  }
  const strIterator = str[Symbol.iterator]();
  console.log(strIterator.next()); // {value: 'h', done: false}
  console.log(strIterator.next()); // {value: 'e', done: false}
  console.log(strIterator.next()); // {value: undefined, done: true}

  // Map Iterator
  const myMap = new Map();
  myMap.set("key1", "value1");
  myMap.set("key2", "value2");
  myMap.set("key3", "value3");

  const mapIterator = myMap.entries();
  console.log(mapIterator.next().value); // ["key1", "value1"]
  console.log(mapIterator.next().value); // ["key2", "value2"]
  console.log(mapIterator.next().value); // ["key3", "value3"]
  console.log(mapIterator.next().value); // undefined

  // Set Iterator
  const set = new Set(["value1", "value1", "value1", "value2"]); // 相当于 const set = new Set(["value1","value2"]);
  for (const item of set) {
    console.log(item);
  }
  const setIterator = set.values();
  let next = setIterator.next();
  while (!next.done) {
    console.log(next.value);
    next = setIterator.next();
  }
  setIterator.next(); // {value: undefined, done: true}
}
// ******************面试题10: 如何使对象 iterable 化， 使其可以支持 for...of 迭代  ******************
{
  // 1.需要实现一个Symbol.iterator的方法
  // 2.该方法返回一个具有next方法的迭代器对象
  // 3.next方法返回{value: any, done: boolean}
  const myObject = {
    items: [1, 2, 3],
    [Symbol.iterator]() {
      let index = 0;
      const items = this.items;
      return {
        next() {
          if (index < items.length) {
            return { value: items[index++], done: false };
          } else {
            return { value: undefined, done: true };
          }
        },
      };
    },
  };

  for (const item of myObject) {
    console.log(item); // 1 2 3
  }
}
// ******************面试题11: 实现一个成员函数，并且该函数无法直接被调用  ******************
{
  class Foo {
    construtor() {}
    method() {
      console.log("Use Method");
    }
  }
  const foo = new Foo();
  foo.method();
  //不希望被其他调用 Foo.prototype.method.call(b);

  const foos = new WeakSet();
  class Foo {
    constructor() {
      foos.add(this);
    }
    method() {
      if (!foos.has(this)) {
        throw new TypeError("methods 只能在Foo实例上使用");
      } else {
        console.log("using");
      }
    }
  }
  b = {};
  Foo.prototype.method.call(b); // VM73:8 Uncaught TypeError: methods 只能在Foo实例上使用
}
// ******************面试题12: 你是怎么理解ES6中的Proxy的，有什么应用场景 ******************
{
  // Proxy用于修改某些操作的默认行为，等同于在语言层面进行修改，所以属于一种元编程(meta programming)，即对编程语言编程。
  // Proxy可以理解为在目标对象之前加一层拦截，外界对该对象的访问，都必须先通过这层拦截。
  // Proxy的用法是, let proxy = new Proxy(target, handler);其中target是需要拦截的目标对象（目标对象也可以是一个Proxy），handler为一个对象，用来定义拦截行为

  // get()方法用于拦截某个属性的读取操作，三个参数，目标对象，属性名和proxy实例本身，proxy参数可以省略
  // get() 应用1: 访问不存在的属性抛出异常而不是返回undefined
  let person = {
    name: "test",
  };

  let personProxy = new Proxy(person, {
    get: function (target, propKey) {
      if (propKey in target) {
        return target[propKey];
      } else {
        throw new ReferenceError(`Prop name ${propKey} does not exist.`);
      }
    },
  });

  personProxy.name; // 'test'
  personProxy.age; // Uncaught ReferenceError: Prop name age does not exist.

  // 延伸： get方法可以继承，是因为拦截操作定义在Prototype上
  let proto = new Proxy(
    {},
    {
      get(target, propertyKey, receiver) {
        console.log("GET " + propertyKey);
        return target[propertyKey];
      },
    }
  );

  let obj = Object.create(proto);
  obj.foo; // "GET foo"

  // get() 应用2: 实现数组读取负值的索引
  function createArray(...elements) {
    const handler = {
      get: function (target, propKey, receiver) {
        let index = Number(propKey);
        if (index < 0) {
          propKey = String(target.length + index);
        }
        return Reflect.get(target, propKey, receiver);
      },
    };

    let target = [];
    target.push(...elements);
    return new Proxy(target, handler);
  }

  let arr = createArray(1, 2, 3, 4, 5);
  console.log(arr[-1]);

  // get() 应用3: 实现属性的链式调用
  // 延伸：const let 的行为属于块级作用域的特性，不会绑定到window上
  function pipe(value) {
    let funcStack = [];
    let proxy = new Proxy(
      {},
      {
        get: function (target, fnName) {
          if (fnName === "get") {
            return funcStack.reduce((val, fn) => {
              return fn(val);
            }, value);
          } else {
            funcStack.push(window[fnName]);
            return proxy;
          }
        },
      }
    );
    return proxy;
  }

  var double = (n) => n * 2;
  var pow = (n) => n * n;
  var reverseInt = (n) => n.toString().split("").reverse().join("") | 0;
  pipe(3).double.pow.reverseInt.get;

  // set()方法用来拦截某个属性的赋值操作，四个参数：目标对象，属性名，属性值和Proxy实例本身（可以省略）
  // set() 实例1: 数据验证，并且自动更新DOM

  //   <div id="app">
  //   <input id="nameInput" type="text" placeholder="请输入名称">
  //   <p>名称：<span id="nameDisplay"></span></p>
  //    </div>

  const data = {
    name: "",
  };

  const nameInput = document.getElementById("nameInput");
  const nameDisplay = document.getElementById("nameDisplay");

  let dataProxy = new Proxy(data, {
    set: function (data, propKey, value) {
      if (propKey === "name") {
        if (value.length > 20) {
          console.log("The name you input is too long");
          return false;
        }
      }
      data[propKey] = value;
      if (propKey === "name") {
        nameDisplay.textContent = value;
      }
      return true;
    },
  });

  nameInput.addEventListener("input", (event) => {
    dataProxy.name = event.target.value;
  });

  // // set() 实例2: 防止内部属性被读写
  // 延伸：receiver 是为了确保 this在继承链中指向当前操作的对象，而不是默认的目标对象。
  const handler = {
    get: function (target, propKey) {
      invariant(propKey, "get");
      return target[propKey];
    },
    set: function (target, propKey, value) {
      invariant(propKey, "set");
      target[propKey] = value;
      return true;
    },
  };
  function invariant(key, action) {
    if (key[0] === "_") {
      throw new Error(`Invalid attempt to ${action} private ${key}`);
    }
  }
  const target = {};
  const proxy = new Proxy(target, handler);

  // apply()方法拦截函数的调用、call和apply操作
  // apply()接收三个参数，分别是目标对象，目标对象的上下文对象(this)，目标对象的参数数组

  var handler = {
    apply: function (target, ctx, args) {
      return Reflect.apply(...arguments);
    },
  };

  // has()方法用来拦截HasProperty操作，即判断对象是否具有某个属性，这个方法会失效，比如in操作符
  // has()方法接收两个参数，目标对象，需查询的属性名
  // 延伸：has()拦截对for...in不生效，如果目标对象禁止扩展，has拦截会报错

  var target = {
    name: "name",
    _name: "_name",
  };

  let targetProxy = new Proxy(target, {
    has: function (target, propKey) {
      if (propKey[0] === "_") {
        return false;
      }
      return propKey in target;
    },
  });
  "_name" in targetProxy; // false
  "name" in targetProxy; // true

  // construct()方法用于拦截new命令
  // 接收三个参数：目标对象，构造函数的参数数组，创造实例对象时，new命令作用的构造函数(下面的proxy)
  // construct方法必须返回一个对象，否则报错，拦截对象必须是函数
  // construct方法中的this指向的是handler，而不是实例对象
  var proxy = new Proxy(function () {}, {
    construct: function (target, args, newTarget) {
      return target(...args);
    },
  });

  // deleteProperty(target, propKey)方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete

  // defineProperty(target, key, descriptor)
  // 它会拦截定义属性的操作，包括通过 Object.defineProperty 或赋值表达式（如 proxy.foo = 'bar'）

  // getOwnPropertyDescriptor(target, key)方法拦截Object.getOwnPropertyDescriptor()

  // getPrototypeOf(target)方法用于拦截捕获对象原型
  // Object.prototype.__proto__
  // Object.prototype.isPrototypeOf()
  // Object.getPrototypeOf()
  // Reflect.getPrototypeOf()
  // instanceof

  // isExtensible(target)拦截Object.isExtensible()

  // ownKeys(target)拦截对象自身属性的读取操作
  // Object.getOwnPropertyNames();
  // Object.getOwnPropertySymbols();
  // Object.keys();
  // for...in循环

  // preventExtensions(target)拦截Object.preventExtensions(),必须返回一个boolean

  // setPrototypeOf(target, proto)拦截Object.setPrototypeOf，必须返回boolean

  // Proxy.revocable用于创建一个可撤销的代理对象。
  // 控制对象的生命周期（限时访问、敏感数据管理）、安全资源管理（插件系统、第三方模块）、防止长期访问或误用不在需要的资源
  // Proxy.revocable 实例1 用于短时间内控制资源访问的场景

  function createSecureResource(target, time = 5000) {
    const { proxy, revoke } = Proxy.revocable(target, {
      get: function (target, propKey) {
        if (propKey in target) {
          return target[propKey];
        }
        throw new Error(`propKey ${propKey} does not exist`);
      },
    });

    setTimeout(() => {
      console.log("Access to resource revoked");
      revoke();
    }, time);
    return proxy;
  }

  const secureData = createSecureResource({ secret: "1234" });
  console.log(secureData.secret);

  // Proxy.revocable 实例2 用于管理插件系统

  function createPluginManager() {
    const plugins = new Map();
    return {
      addPlugin(name, plugin) {
        const { proxy, revoke } = Proxy.revocable(plugin, {
          get: function (target, propKey) {
            if (propKey in target) {
              return target[propKey];
            }
            throw new Error(`There is no ${propKey} in ${target}`);
          },
        });
        plugins.set(name, { proxy, revoke });
      },
      removePlugin(name) {
        if (plugins.has(name)) {
          plugins.get(name).revoke();
          plugins.delete(name);
          console.log(`Plugin ${name} has been deleted`);
        }
      },
      getPlugin(name) {
        return plugins.get(name)?.proxy;
      },
    };
  }

  const pluginManager = createPluginManager();
  pluginManager.addPlugin("Logger", {
    log: (msg) => console.log(`[PlguinLog] ${msg}`),
  });

  const logger = pluginManager.getPlugin("Logger");
  logger.log("Hello World");
  pluginManager.removePlugin("Logger");
  try {
    logger.log("This should not work"); // TypeError: Cannot perform 'get' on a proxy that has been revoked
  } catch (err) {
    console.error(err.message);
  }

  // this问题：
  // 目标对象内部的this关键字会指向Proxy代理
  // 使用bind显式绑定原始对象
  // Proxy拦截函数内的this指向的是handler对象

  // 综合：应用场景1 Web客户端
  function createWebService(baseUrl) {
    return new Proxy(
      {},
      {
        get: function (target, propKey, receiver) {
          return () => httpGet(`baseUrl/${propKey}`);
        },
      }
    );
  }
  const service = createWebService("http://example.com/data'");
  service.employee().then((json) => {
    const employee = JSON.parse(json);
  });

  // 综合： 应用场景2 观察者模式
  // 扩展：观察者模式工作流程：1. Subject维护一个Observer的列表 2.Observer通过订阅将自己加入到Subject的Observer列表 3.当Subject的状态发生变化，通知列表中的所有Observers 4.Observer收到通知进行相应的变化

  class Observable {
    constructor(target) {
      this.target = target;
      this.observers = [];

      return new Proxy(this, {
        get: (obj, propKey) => {
          if (propKey in obj) {
            return obj[propKey];
          } else {
            return this.target[propKey];
          }
        },
        set: (obj, propKey, value) => {
          if (propKey in this.target) {
            const oldValue = this.target[propKey];
            this.target[propKey] = value;

            if (oldValue !== this.target[propKey]) {
              this.notify(propKey, value, oldValue);
            }
          }
          return true;
        },
      });
    }

    subscribe(observer) {
      if (typeof observer === "function") {
        this.observers.push(observer);
      }
    }

    notify(propKey, value, oldValue) {
      this.observers.forEach((observer) => observer(propKey, value, oldValue));
    }
  }

  const mockData = { count: 0, message: "Hello" };
  const observableData = new Observable(mockData);
  observableData.subscribe((propKey, value, oldValue) => {
    console.log(
      `The first one: propKey: ${propKey}, value: ${value}, oldValue: ${oldValue}`
    );
  });
  observableData.subscribe((propKey, value, oldValue) => {
    console.log(
      `The second one: propKey: ${propKey}, value: ${value}, oldValue: ${oldValue}`
    );
  });
  observableData.count = observableData.count + 1;

  // 扩展，handler中this的指向，如果是普通函数，this指向handler本身，如果是箭头函数，this指向箭头函数定义时的上下文。
  // 对象本身不会作为作用域。对象中的函数定义时的作用域，通常是它所在的上下文（例如全局、模块或函数）。JavaScript中的作用域仅由 函数（函数作用域）、块（块级作用域）、全局环境（全局作用域）组成
  // 对象只是存储键值对的集合。JavaScript 不将对象的属性视为作用域中的变量。访问对象属性需要通过对象的键名明确访问，而作用域中的变量可以直接访问。
}
// ******************面试题13: 请简单介绍Reflect ******************
{
  // 1.将Object一些明显属于语言内部的方法放到Reflect上，现阶段这些方法同时在Object和Reflect上存在，未来新方法只在Reflect上
  // 2.修改了某些Object方法的返回结果，例如Reflect.defineProperty(obj, name, desc)会返回false而不是抛出错误当无法定义属性时
  // 3.将一些命令式的操作转换为函数行为
  // 4.Reflect对象的方法与Proxy对象的方法一一对应，可以通过Reflect获取默认行为
  // 延伸：Reflect.set()如果传入了receiver，会触发defineProperty拦截
}
// ******************面试题14: 请介绍下super的指向 ******************
{
  // super的指向取决于super使用的位置
  // 1.super用在构造函数中，此时super调用的是父类的构造函数，并将返回的实例绑定到this上，所以在子类的构造函数中，必须先调用super
  // 2.super在普通方法中，指向的是父类的原型对象(Parent.prototype) 延伸：父类绑定到this上的属性，方法属于绑定到对象实例上，所以普通方法中super不能访问这些属性方法
  // 3.super在静态方法指向父类
  // 4.在属性访问器中，super可以用来调用父类的getter或者setter
}
// ******************面试题15: ES6里的类就是构造函数的语法糖，这个说法是否正确 ******************
{
  // 是的，ES6 的类是构造函数的语法糖，它背后仍然是基于构造函数的机制。但类提供了更多功能，例如 super、严格模式、不可枚举方法、继承的自动设置等，这些特性使类在语义上更加贴合面向对象编程，也更加安全和规范。
  // 延伸：typeof class是一个function
  class MyClass {
    constructor(name) {
      this.name = name;
    }
  }
  console.log(typeof MyClass); // "function"
  console.log(MyClass === MyClass.prototype.constructor); // true
}
// ******************面试题16: common.js和es6模块引入的区别 ******************
{
  // CommonJS是一种模块系统，主要用于Node.js环境中。它使用require函数引入模块，使用module.exports导出模块
  // 实例：
  // util.js
  function getName() {
    return "getName";
  }
  function getAge() {
    return "getAge";
  }
  const nameAge = "nameAge";
  module.exports = {
    getName,
    getAge,
    nameAge,
  };
  module.exports.getName = getName;
  module.exports.getAge = getAge;
  module.exports.nameAge = nameAge;
  // main.js
  const { getName } = require("./util");
  const util = require("./util");
  const getName = util.getName;
  // CommonJS的动态导入
  if (condition) {
    const moduleA = require("./moduleA");
  }
  // require是同步的，模块在执行require时立即加载并返回结果
  // 对于导出的对象和数组等引用类型，修改引用类型的属性会在所有引用中反映出来，如果是基本数据类型，导出的是copy
  // 运行时确定模块依赖

  //ES6模块系统是ESCAScript标准的一部分，使用import和export语法定义模块，用于现代前端开发和一些支持es6的服务器环境
  //导出模块有两种方式：命名导出和默认导出

  // 命名导出
  // export const add = (a, b) => a + b;
  // export const subtract = (a, b) => a - b;

  // 默认导出
  // export default function multiply(a, b) {
  //   return a * b;
  // }

  //导入模块：导入命名导出的，必须与导出名称一致，默认导出的可以使用任意名称
  // import multiply, { add, subtract } from './math.js';

  // ES6 Module是静态引入，这要求所有的import必须在文件的顶部声明，不能在函数体或者条件语句中使用。这使得ES6模块可以在编译时确定依赖关系和优化
  // ES6 Module是异步加载，不会阻塞页面的其他加载过程
  // 导出的是值得引用，当导出模块的值发生变化时，所有引用该变量的地方又会反映这些变化

  // 总结：
  // 1.模块加载方式
  // CommonJS是同步加载，在执行require时同步加载所需模块（这在服务器端问题不大，因为文件大概率都在本地）
  // ES6 Module采用静态分析，在编译时确定模块的依赖关系，支持异步加载，更适合在浏览器环境下使用。
  // 静态分析有以下好处：依赖关系明确，在编译阶段就能发现错误，可以使用tree shaking以及死代码消除（无法到达的代码），实际中可以并行加载，预加载和预解析，有助于性能提升
  // 2.导入导出语法
  // CommonJS: require/module.exports/exports ES6 Module: import/export
  // 3.导入导出的绑定方式
  // CommonJS导出的是值得拷贝，模块加载后，导出的值不会随着模块内部变化而变化
  // ES6 Module采用实时绑定(living bindings)，导入的值会随着模块内部的变化实时更新，即导入的是对原始变量的引用
  // 4.执行时机
  // CommonJS是运行时被加载，当代码执行到require时，才会加载并同步执行。
  // ES6 模块是在编译时加载，在脚本执行前，依赖关系就已经被解析。JavaScript引起可以在代码执行前构建模块依赖图，在执行阶段，按照依赖关系，采用深度优先的方式执行模块代码
  // 5.this关键字的指向
  // CommonJS中，顶部的this指向module.exports
  // ES6 Module中，顶部的this指向undefined，因为ES6模块默认采用的是严格模式
  // 6.应用的环境
  // CommonJS主要用于Node.js，适合服务器端的模块化开发（因为服务器端的文件都在本地，加载速度快，即使是同步加载不会有性能问题）
  // ES6 Module原生支持浏览器，浏览器通过网络请求获取文件，异步加载可以提高性能，避免阻塞。<script type="module">
  // ES6 Module如果想在node环境中支持，从node13开始正式支持，需要在package.json中添加type:"module"或者使用.mjs扩展名
  // 7.是否支持动态导入
  // CommonJS支持动态导入，可以在代码运行过程中判断是否加载某个模块
  // ES6 Module是静态导入，本事不支持动态导入，但是可以使用import()函数实现动态导入，已经被广泛支持。
  // if (condition) {
  //   import("moduleA").then((module) => {});
  // }
  // 8.模块缓存
  // CommonJS模块在第一次执行require时，模块会被执行，导出的对象会被缓存到内存中，后续再次require它时，会直接返回缓存中的结果
  // ES6 Module同样会对模块进行缓存，确保模块在整个应用中是单例的
  // 9.循环依赖处理
  // 两者都允许模块之间存在循环依赖，提供一定的灵活性
  // CommonJS在处理循环依赖时，可能导致导入的模块不完整，访问未定义的属性需要谨慎，调试困难
  //    可能通过将导入模块的使用延迟到模块加载完成后（例如封装在函数中，在加载完成后再调用）
  // ES6 Module由于实时绑定和编译时解析的特性，在处理循环依赖时更加可靠，但是需要注意暂时性死区的问题，避免在顶层作用域中访问未初始化的导入变量。
}
// ******************面试题17: 什么是let的暂时性死区 ******************
{
  //在JavaScrit中，当引擎解析代码并进入一个块级作用域时，let和const声明的变量会在解析阶段就被绑定到作用域中，即变量已经被分配了内存位置
  //但是他们并没有被初始化为具体的值，处于未初始化的状态，这种状态会持续到代码实际执行到声明语句位置，这段时间成为暂时性死区TDZ
  //具体一点：JavaScript的执行过程分为两个阶段，解析（编译）阶段和执行阶段，在解析阶段时，引擎会先扫描代码，确定作用域规则，把let、const、var、函数声明等记录在相应的作用域中
  // 对于var声明的变量，会被提升，并定义为undefined，对于let和const声明的变量，只是被绑定但不会真正初始化 ReferenceError: Cannot access 'x' before initialization
}
// ******************面试题18: Map和WeakMap的区别 ******************
{
  // Map 和 WeakMap都是存储键值对的数据结构，但是他们在键类型，垃圾回收机制、迭代以及使用场景有所不同
  // 键的类型：
  //    Map的键可以是任何类型，包括对象、字符串、数字等(包括null和undefined), 键是强引用，意味着不会因为其他地方没有引用而被垃圾回收
  //    WeakMap的键只能是对象，它的键是弱引用，意味着如果其他地方没有引用找个对象，它会被垃圾回收
  //    延伸：普通对象也可以把null和undefined当成key,不过实际上是转成了字符串
  // 垃圾回收机制：
  //    Map键和值是强引用，意味着不会因为其他地方没有引用而被垃圾回收
  //    WeakMap如果键的对象没有其他引用，垃圾回收器会自动清除它和相关的值。
  // 迭代：
  //    Map支持迭代，可以用map.keys(),map.values(),map.entries()以及for...of
  //    WeakMap不支持迭代
  // 使用场景：
  //    Map适合任意类型的键值对储存，且数据需要持久化，比如缓存、字典
  //    WeakMap适合临时存储与对象关联的数据，比如给DOM元素添加元数据或跟踪对象的额外信息，自动删除关联信息，比如统计一个button点击次数，
  //    key为button对象，当button被移除时。相关记录会被移除
}
// ******************面试题19: 说说你对new.target的理解 ******************
{
  // new.target属性是一个特殊属性，用来判断函数或者构造函数是否通过new调用，当通过new调用时，new.target指向该函数或者构造函数，如果不是，返回undefined
  // 可以用new.target限制一个函数是否可以通过new调用
  // 实例：可以用new.target实现抽象类
  class AbstractClass {
    constructor() {
      if (new.target === AbstractClass) {
        throw new Error("AbstractClass is a abstract class");
      }
    }
    abstractMethod() {
      throw new Error("抽象方法必须由子类实现！");
    }
  }
  class subClass extends AbstractClass {
    constructor() {
      super();
      console.log("success");
    }
    abstractMethod() {
      console.log("子类实现了抽象方法！");
    }
  }
  new AbstractClass(); // Uncaught Error: AbstractClass is a abstract class
  let instance = new subClass(); // success
  instance.abstractMethod(); // 子类实现了抽象方法！
}
// ******************面试题20: 说说你对async/await的理解 ******************
{
  // async/await是JavaScritp中处理异步编程的语法糖，基于Promise对象，ES8引入
  // 基于Promise、代码同步化、错误处理简单，能直接try...catch
  // await不会阻塞主线程，只会阻塞当前async的函数，不影响其他异步任务的执行，直接调用promise会返回一个promise
  // 从 ECMAScript 2022（ES13）开始，await 可以在模块的顶层使用，无需将代码包裹在 async 函数中。如果 await 出现在一个函数内部，该函数必须使用 async 关键字声明
  // Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules
}
// ******************面试题21: 使用async/await时，是否有必要加try...catch ******************
{
  // 一般情况下，最好添加，但是如果确信调用者中能够捕获错误，则不需要加，而是抛出错误给调用者
}
// ******************面试题22: es5和es6中的class有什么区别 ******************
{
  // es5中我们通过构造函数和原型的方式定义一个类，在es6中，添加了语法糖，可以使用class定义类
  // class的本质虽然是function，但是不能直接调用
  // class定义不会有变量提升
  // class，无法变量对象原型链上的属性和方法
  // es6引入了new.target
  // class有静态方法
}
// ******************面试题23: async/await 怎么进行错误处理？ ******************
{
  // 首先async/await是promise的语法糖，所以await后面接一个promise 所以可以await fetchData().then(data=>[null, data]).catch(err=>[err, null])
  function awaitWrap(promise) {
    return promise.then((data) => [null, data]).catch((err) => [err, null]);
  }
  const [err, data] = await awaitWrap(fetchData());
}
// ******************面试题24: Map 和 Set 的用法以及区别 ******************
{
  // Map 是一个用于存储键值对的集合，其中键和值都可以是任意类型。
  // Set 是一个用于存储唯一值的集合，所有值都是唯一的，且值可以是任何类型
  // Set可以用来去重
  let arr = [1, 1, 2, 2, 3, 4, 5];
  let arr2 = [...new Set(arr)];
}
// ******************面试题25: 哪些类型可以解构 ******************
{
  // 延伸：解构不是扩展运算符 ... 是扩展运算符，...用于将可迭代对象展开为单独的元素
  // 数组
  const arr = [1, 2, 3];
  const [a, b, c] = arr;
  console.log(a, b, c); // 1 2 3

  const [, , third] = [1, 2, 3];
  console.log(third); // 3
  const [first, ...rest] = [1, 2, 3];
  console.log(rest); // [2,3]
  // 对象
  const obj = { name: "Alice", age: 25 };
  const { name, age } = obj;
  console.log(name, age); // Alice 25
  // 字符串
  const str = "hello";
  const [h, e, l, o] = str;
  console.log(h, e, l, o); // h e l o
  const arr1 = [..."string"];
  console.log(arr1); // ['s', 't', 'r', 'i', 'n', 'g']
  // 函数参数(对象参数， 数组参数)
  function greet({ name, age }) {
    console.log(name, age);
  }
  greet({ name: "Alice", age: 25 });
  function greet([a, b]) {
    return a + b;
  }
  // Map
  const map = new Map();
  map.set("name", "Alice");
  map.set("age", 25);

  for (const [key, value] of map) {
    console.log(key, value);
  }
  // Set
  const set = new Set([1, 2, 3]);
  const [a1, b1, c1] = set;
  console.log(a1, b1, c1); // 输出: 1 2 3
}
// ******************面试题26: 说说对 ES6 中rest参数的理解 ******************
{
  // 形式为...rest, 用于获取函数的多余参数，是一个真正的数组。函数的length不包含rest部分，rest之后能再有其他参数
  (function (a) {})
    .length(
      // 1
      function (...a) {}
    )
    .length(
      // 0
      function (a, ...b) {}
    ).length; // 1
}
