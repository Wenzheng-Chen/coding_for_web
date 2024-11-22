// ******************面试题1: in 运算符的作用是什么******************

// 可以用来判断是否是某个对象的属性，常用来做类型守卫, 增强类型安全性

type Cat = { type: "cat"; meow: () => void };
type Dog = { type: "dog"; bark: () => void };

function handleAnimal(animal: Cat | Dog) {
  if ("meow" in animal) {
    animal.meow();
  } else {
    animal.bark();
  }
}
handleAnimal({
  type: "cat",
  meow: () => {
    console.log("meow");
  },
});

// ******************面试题2: Typescript中extends的作用******************

// 应用1: 类继承，在类继承中，子类可以访问父类所有public或者protected的成员
// 延伸: public方法可以在任意地方访问， private：只能在当前类中访问，protected: 可以在定义他的类和他的子类中访问，但是不能通过外部实例访问
// 延伸：子类继承static方法
class Animal {
  static testStatic() {
    console.log("static");
  }
  private testPrivate() {
    console.log("private");
  }
  protected testProtected() {
    console.log("protected");
  }
  move() {
    console.log("move");
  }
}
class Bird extends Animal {
  fly() {
    this.testProtected();
    console.log("fly");
  }
}
const bird: Bird = new Bird();
const animal: Animal = new Animal();
// animal.testProtected(); Error
// animal.testPrivate(); Error
// animal.testStatic();  Error
Animal.testStatic(); // static
bird.move(); // move
bird.fly(); //fly
Bird.testStatic(); //static
// bird.testProtected();  Error

// 应用2: 类型约束
// 延伸：在使用泛型时，可以显示指出具体类型，或者当可以推断出具体类型时，可以省略
function logLength<T extends { length: number }>(input: T) {
  console.log(input.length);
}
logLength([1, 2, 3]);
logLength({ length: 100 });
logLength("string");
// logLength(123);  Argument of type 'number' is not assignable to parameter of type '{ length: number; }'

// 应用3: 类型推导中的条件类型
// 示例1：当开发一个通用的API调用工具时，可以动态提取有效的data类型，避免手动处理
type ApiResponse<T> = T extends { data: infer D } ? { data: D } : never;
type UserResponse = { data: { name: string; id: number } };
type ErrorResponse = { error: string };

type UserData = ApiResponse<UserResponse>;
type ErrorData = ApiResponse<ErrorResponse>;

// 示例2：提前方法的返回值类型,自动生成类型安全的工具函数，比如动态代理或装饰器，确保操作的返回值类型与原始方法一致。
// 延伸：在TypeScript中，索引引用操作符允许我们通过健来访问对象类型中属性的类型 UserService["getUser"]
class UserService {
  getUser(id: number): { id: number; name: string } {
    return { id, name: "John Doe" };
  }
}
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;
type GetUserReturnType = ReturnTypeOf<UserService["getUser"]>;

// 应用4: 接口继承
interface Shape {
  color: string;
}

interface Circle extends Shape {
  radius: number;
}

const circle: Circle = {
  color: "red",
  radius: 10,
};

// ******************面试题3: infer关键字是什么******************
// 在TypeScript中，infer关键字用于在条件类型中推断类型，它允许在条件类型中声明一个类型变量并推断的它的类型，通常用来提取或推断复杂类型的内部结构

// 应用1: 推断数组元素的类型
type ElementType<T> = T extends (infer R)[] ? R : never;
type NumberArray = ElementType<number[]>;
type StringArray = ElementType<string[]>;
type NotArray = ElementType<number>;

// 应用2: 推断函数的返回值类型
type Infer_RetureType<T> = T extends (...args: any[]) => infer R ? R : never;
type Func = () => string;
type Result = Infer_RetureType<Func>; // string

// 应用3: 推断Promise的解析类型
type Infer_Awaited<T> = T extends Promise<infer R> ? R : T;
type ResolvedType1 = Infer_Awaited<Promise<number>>; // number
type ResolvedType2 = Infer_Awaited<Promise<string>>; // string
type ResolvedType3 = Infer_Awaited<number>; // number (非 Promise 类型直接返回自身)
// 使用场景：当你处理异步函数时，返回值通常是一个 Promise，你可能需要知道解析后的值类型。
async function fetchData(): Promise<number> {
  return 42;
}
// typeof fetchData：() => Promise<number>
type DataType = Awaited<ReturnType<typeof fetchData>>; // number

// ******************面试题4: 联合类型是什么******************
// 联合类型(Union Type)允许一个变量、参数或者返回值接受多种不同的类型，通过使用 | 来定义

let value: string | number;
value = "string";
value = 10;
// value = true;  Type 'boolean' is not assignable to type 'string | number'.

// ******************面试题4: unknown类型是什么******************
// unknown表示一个未知类型的值，相比any更加安全，因为他在进行操作之前必须进行类型检查或者类型断言
function handleUnknown(value: unknown) {
  if (typeof value === "string") {
    console.log(value.toLowerCase());
  } else if (typeof value === "number") {
    console.log(value.toFixed(2));
  } else {
    console.log("Unsupported type");
  }
}

// ******************面试题4: never类型是什么******************
// never类型表示不可能发生的值，适用于不会返回值的函数或者不可能到达的代码路径
// 应用场景：函数（抛出错误或者无限循环），类型保护（确保所有分支都处理完毕），函数参数不会出现的类型
// 延伸：void 表示函数可以返回 undefined，但 never 明确表示该函数根本不会返回。
// 因为TypeScript最终会编译成JavaScript供浏览器运行，所以例如never这种Type关键字都是用于减少编写代码阶段的问题的，有助于编译器静态分析

// 更清晰的语意表达
function never_crash(message: string): never {
  throw new Error(message); //开发者明确这个函数永远不会返回
}
function testNeverCrash(): void {
  never_crash("crashMessage");
  console.log("testCrash"); // Unreachable code detected.
}
function void_crash(message: string): void {
  throw new Error(message);
}
function testVoidCrash(): void {
  void_crash("crashMessage");
  console.log("testCrash"); // 编译器没有任何的提示，很容易出问题
}

// 提高类型检查的精确性，捕捉未处理的逻辑分支，比如当未来扩展Action，可以帮助catch这些扩展
type Action = "start" | "stop" | "pause";

function handleAction(action: Action): void {
  switch (action) {
    case "start":
      console.log("Starting");
      break;
    case "stop":
      console.log("Stopping");
      break;
    default:
    // 如果这里没有声明为 `never`，遗漏分支可能不会被发现
    // const exhaustiveCheck: never = action; // Type 'Action' is not assignable to type 'never'.
    // throw new Error(`Unhandled action: ${exhaustiveCheck}`);
  }
}

// 提供更为严格的设计约束
function processForever(callback: () => never): void {
  callback();
  console.log(); // Unreachable code detected.
}

// 作为函数参数
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}
function handle(value: "a" | "b") {
  switch (value) {
    case "a":
      console.log("a");
      break;
    case "b":
      console.log("b");
      break;
    default:
      assertNever(value);
  }
}

// ******************面试题5: 说说const和readonly的区别******************
// const是JavaScript的一个关键字，用于声明一个常量的，使用const定义的变量如果是基础类型不能改变，如果是引用类型，不能被覆盖，但是内容可以发生变化
// readonly是TypeScript特有的关键字，主要用于指定类或者接口的属性或者数组对象为只读，用readonly修饰过的属性，无论基础类型还是引用类型，都不能被覆盖，内容不能发生变化

// 在类中使用
class Person {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
}
let person = new Person("Test readonly");
// person.name = "Change"; Cannot assign to 'name' because it is a read-only property.

// 在接口中使用
interface ReadOnlyPerson {
  readonly name: string;
}
let readOnlyPerson: ReadOnlyPerson = { name: "test interface readonly" };
// readOnlyPerson.name = "change";  Cannot assign to 'name' because it is a read-only property.

// 在数组中使用
let numbers: readonly number[] = [1, 2, 3, 4];
// numbers.push(5); Property 'push' does not exist on type 'readonly number[]'.
// numbers[0] = 5; Index signature in type 'readonly number[]' only permits reading.
// numbers.length = 10; Cannot assign to 'length' because it is a read-only property

// ******************面试题6: 枚举和常量枚举的区别******************
// 普通枚举在编译时会生成一个对象，包含枚举和他的成员，而常量枚举在编译时不会生成对象代码，而是将所有的枚举成员直接内联到代码中，但是常量枚举也会失去反向映射的能力

enum normalEnum {
  a,
  b,
  c,
  d,
}
console.log(normalEnum["a"]);

const enum constEnum {
  a,
  b,
  c,
  d,
}
console.log(constEnum["a"]);

// 上述代码会被编译成
// "use strict";
// var normalEnum;
// (function (normalEnum) {
//     normalEnum[normalEnum["a"] = 0] = "a";
//     normalEnum[normalEnum["b"] = 1] = "b";
//     normalEnum[normalEnum["c"] = 2] = "c";
//     normalEnum[normalEnum["d"] = 3] = "d";
// })(normalEnum || (normalEnum = {}));
// console.log(normalEnum["a"]);
// console.log(0 /* constEnum["a"] */);

// ******************面试题7: 纯TS项目工程中，如何使用alias path******************
// 在纯TypeScript项目使用alias path可以简化模块的导入路径，关键步骤如下：

// 配置tsconfig.json文件，在该文件中需要配置baseUrl 以及 paths
// tsconfig.json 中的路径别名主要用于 TypeScript 编译器，影响开发时的类型检查和代码提示。

// {
//     "compilerOptions": {
//       "baseUrl": "./",
//       "paths": {
//         "@components/*": ["src/components/*"],
//         "@utils/*": ["src/utils/*"]
//       }
//     }
//   }

// 配置webpack.config.js
// webpack.config.js 中的路径别名主要用于 Webpack 打包时，影响运行时的模块解析。

// const path = require('path');

// module.exports = {
//   resolve: {
//     alias: {
//       '@components': path.resolve(__dirname, 'src/components'),
//       '@utils': path.resolve(__dirname, 'src/utils'),
//     },
//     extensions: ['.js', '.ts', '.tsx'] // 确保解析 .ts 和 .tsx 文件
//   },
// };

// 使用时可以直接
// import Button from '@components/Button'

// ******************面试题8: TypeScript中is关键字的作用******************
// is关键字用于类型保护，它不仅告诉了类型保护函数会返回boolean，并且更重要的是能向TypeScript提供类型推导信息, 省去了手动断言的过程

class Is_Animal {
  eat() {
    console.log("eat");
  }
}

class Is_Cat extends Is_Animal {
  meow() {
    console.log("meow");
  }
}

function isCat(animal: Is_Animal): animal is Is_Cat {
  return "meow" in animal;
}

function isCatBoolean(animal: Is_Animal): boolean {
  return "meow" in animal;
}

function testIs(animal: Is_Animal) {
  if (isCat(animal)) {
    animal.meow(); // 通过类型保护，直接将animal实际为Is_Cat对象的信息传递给了编辑器，不会报错
  }
}

function testBoolean(animal: Is_Animal) {
  if (isCatBoolean(animal)) {
    //  animal.meow();  报错 Property 'meow' does not exist on type 'Is_Animal'，需要手动断言
    (animal as Is_Cat).meow();
  }
}

// ******************面试题9: 如何将unknown类型指定为一个更具体的类型******************
// 延伸：可以将任何类型赋值给unknown类型的变量，在编译时会进行类型检查，不能通过类型断言真正的改变类型，只是告诉编译器“我确信它的类型”
// 1.使用类型判断，缩小类型范围
function unknownToString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  return String(value);
}
// 2.使用类型断言
let unknownValue: unknown = "string";
console.log((unknownValue as string).length);

// ******************面试题10: TypeScript中命名空间和模块的异同******************
// TypeScrpt中的模块同ES5的一样，任何包含顶级import或者export的文件都会被看作一个模块，相反的，如果文件不包含顶级import或者export，那他的内容就全局可见，组织依赖关系
// 命名空间的目的是解决重名问题，定义了标识符的可见范围，命名空间的本质是一个对象，用于将一系列相关的全局变量组织到一个对象的属性，但很难识别依赖关系，一般用在d.ts文件标记js库类型的时候用
export namespace XML {
  export const XML_HEADER: string = '<?xml version="1.0"?>';
  export const GET_REDIRECT_SETTING: string = "get-protocol-redirect-settings";
  export const GET_DESKTOP_CONNECTION_REDIRECT: string =
    "get-desktop-connection-redirect";
}

// ******************面试题11: tsconfig.json文件有什么用******************
// tsconfig.json文件中，可以指定不同的选项来告诉编译器如何编译当前的项目，定义了如何将TS代码编译成JS代码，以及相关的编译选项和规则。

// 常用的编译选项

// compilerOptions.target：指定生成的JavaScript的目标版本，兼容不同的浏览器 需要兼容IE11的项目，必须选择ES5
// compilerOptions.module: 指定使用哪种模块系统，前端项目一般选择 ESNext，以便使用动态导入和 Tree Shaking；Node.js 项目使用 CommonJS，因为它是 Node.js 的默认模块规范
// compilerOptions.lib: 指定编译时需要包含的库声明，据运行环境选择合适的库。例如，浏览器项目需要 DOM 和 ES6，而 Node.js 项目通常只需 ES6 或更高版本
// compilerOptions.outDir/rootDir: outDir指定编译后的输出目录，rootDir指定TypeScript文件的根目录
// compilerOptions.strict: 启用所有严格类型检查，是 TypeScript 项目的最佳实践。它包括 noImplicitAny、strictNullChecks 等
// compilerOptions.baseUrl和paths: baseUrl:模块导入的根路径， path: 用于定义路径alias path，方便模块导入
// compilerOptions.resolveJsonModule： 是否允许导入JSON模块
// include/exclude：指定要编译以及派出的特定文件或目录
// files：用于显示指定要编译的文件，适用于小型项目
// extends：用于继承公共配置文件

//延伸：rootDir和baseUrl的区别：rootDir定义输入文件的根目录，影响的编译的输出结构（编译哪些文件）baseUrl定义模块导入的基础路径，影响的是模块解析
//延伸：files和include/exclude冲突时：files优先级最高，files包含的文件一定会被编译

// ******************面试题12: TypeScript中的方法重写是什么******************
// super 的使用： 在重写时，如果需要调用父类的实现，可以使用 super
// 抽象类中的重写： 如果父类是抽象类，子类必须实现抽象方法：

class ReWriteParent {
  testFun(value: string) {
    console.log("from parent");
  }
}
class ReWriteChild extends ReWriteParent {
  testFun() {
    console.log("from Child");
  }
}

let obj = new ReWriteChild();
obj.testFun(); // from Child
// obj.testFun("Has Param"); // Expected 0 arguments, but got 1.

// ******************面试题13: 如何检查TypeScript中的null和undefined ******************
// 延伸 == 和 === 区别
// == 是宽松的，在比较时，会先进行类型转换，然后在比较，所以不要求类型转换

// console.log(1 == '1');  // true，因为字符串 '1' 被转换为数字 1
// console.log(true == 1); // true，因为 `true` 被转换为数字 1
// console.log(null == undefined); // true，因为它们被认为是相等的
// console.log([] == '');  // true，因为空数组被转换为空字符串
// console.log('0' == false); // true，因为 '0' 被转换为数字 0，而 false 也被转换为数字 0

const valueCheck: null | undefined = null;

if (valueCheck === null) {
  // 必须使用严格比较
  console.log("Value is null");
} else if (valueCheck === undefined) {
  console.log("Value is undefined");
}

const valueCheck_0: null | undefined = undefined;

if (valueCheck_0 === null) {
  console.log("Value is null");
} else if (typeof valueCheck_0 === "undefined") {
  console.log("Value is undefined");
}

// ******************面试题14: .d.ts 声明文件是什么 ******************
// 声明文件是TypeScript用于描述JavaScript代码类型信息的文件，扩展名为.d.ts，主要作用是为TypeScript提供类型检查和代码补全支持，而不包含任何运行时的逻辑
// 具有以下特点：1.帮助TypeScript理解JavaScript代码的结构，例如变量、函数、类、模块的类型 2.防止使用为定义的全局变量或者第三方模块时，避免编译器报错 3。提高编码效率 4.为没有类型定义的JS库提供类型信息
// 可以通过 @types 安装社区定义的声明文件 npm install --save-dev @types/lodash
// 可以通过配置 tsconfig.json 的 declaration 选项生成声明文件
declare const GLOBAL_VAR: string;
// declare module "lodash" {
//   export function chunk<T>(array: T[], size: number): T[][];
// }
// declare module 'custom-module' {
//     export function doSomething(): void;
//   }

// ******************面试题15: 什么是TypeScript Declare关键字 ******************
// 所有的JavaScript库都没有TypeScript声明文件，但是我们希望在TypeScript文件中使用它们时不会报错，我们可以使用declare在可能存在其他地方变量的环境声明和方法中。
// declare用于声明全局变量、函数、类等，这些声明不会被编译成JS代码，而是用于提供类型信息等，不会影响代码的执行

// ******************面试题16: 什么是TypeScript的方法重载 ******************
// 在同一个类中，可以定义多个同名的方法，但他们的参数列表不同，可能不同的参数列表调用不同的方法
// 在TypeScript中的重载：重载的意义在于为复杂的调用逻辑提供清晰的类型支持和明确的开发指导，
// 而不是运行时的功能实现。如果代码简单，可以直接用可选参数；但对于复杂的场景，重载可以让代码更规范、更可维护。
// 编译阶段的工具： TypeScript 的重载只是一个编译时的类型检查工具，帮助开发者描述同一个方法可能有的多种调用方式。
// 运行时不存在重载： TypeScript 在编译后会将所有重载方法合并为一个实际的实现方法。运行时的 JavaScript 代码中只会保留这个实现方法，而没有所谓的“多个重载方法”。
// 内部区分逻辑： 在方法的实现部分，通过运行时的逻辑（如 typeof 或 if 判断）区分参数类型或数量，从而决定执行哪种行为。
// Java（或 C# 等语言）： 重载是运行时的功能，不同的方法签名会生成不同的方法。 调用时，根据传入的参数，直接匹配最合适的方法，无需手动判断
class ReUsed {
  reusedFunc(name: string): void;
  reusedFunc(name: string, id: number): void;
  reusedFunc(name: string, id?: number): void {
    // 使用可选参数
    if (typeof id === "number") {
      console.log("id");
    } else {
      console.log("name");
    }
  }
}

// ******************面试题17: interface和type的区别是什么 ******************
// 相同点1： 都可以描述一个对象或者函数
interface interfaceObj {
  name: string;
  id: number;
}
type typeObj = {
  name: string;
  id: number;
};
interface interfaceFun {
  (name: string): void;
}
type typeFun = (name: string) => void;
// 相同点2：都可以扩展并且可以互相扩展,interface扩展用extends, type扩展用&
interface Name {
  name: string;
}
interface User extends Name {
  id: number;
}
type Name_0 = {
  name: string;
};
type User_0 = Name_0 & { id: number };
interface User_1 extends Name_0 {
  id: number;
}
type User_2 = Name & { id: number };
// 不同点1: type可以声明基本变量别名
type myString = string;
const testAliasString: myString = "testAliasString";
console.log(typeof testAliasString === "string"); //true
// 不同点2: type可以联合类型
type person = string | number;
// 不同点3:具体定义数组每个位置的类型
type PersonList = [string, number];
const testArray: PersonList = ["string", 2];
// 延伸：可以使用typeof获取具体的type, typeof 只能判断 "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
// 不同点4: interface能够声明合并
interface User_interface {
  name: string;
}
interface User_interface {
  age: number;
}
const userInstance: User_interface = {
  name: "name",
  age: 25,
};

// ******************面试题18: TypeScript 中泛型是什么 ******************
// 泛型是一种编程技术，允许我们在不指定具体类型的情况下定义函数、接口或者类，提高代码的复用性。
// 函数
function returnItem<T>(para: T): T {
  return para;
}
returnItem("string"); // 可以推断时，不需要显示定义 returnItem("string");
returnItem<string>("string");
// 接口/type
interface ReturnItemFn<T> {
  (Para: T): T;
}
const returnItemFn: ReturnItemFn<number> = (para: number) => para;
console.log(returnItemFn(1)); // 1
type ReturnItemT<T> = (para: T) => T;
const returnItemT: ReturnItemT<number> = (para: number) => para;
console.log(returnItemT(2)); // 2

//类
type params = string | number;
class Stack<T extends params> {
  private arr: T[] = [];
  public push(value: T): void {
    this.arr.push(value);
  }
  public pop(): T | undefined {
    return this.arr.pop();
  }
}
const stack_0 = new Stack<string>();
const stack_1 = new Stack<number>();
// const stack_2 = new Stack<boolean>(); //Type 'boolean' does not satisfy the constraint 'params'
// 高级使用：索引类型、约束类型 索引类型 keyof T把传入的对象的属性类型取出生成一个联合类型 keyof {name:"name", age: number} => string | number

type a = keyof { name: "name"; age: 10 };
const a1: a = "name";
const a2: a = "age";
// const a3: a = true Type 'true' is not assignable to type '"name" | "age"'

function getValue<T extends Object, U extends keyof T>(obj: T, key: U) {
  return obj[key];
}
const valueTest = {
  name: "name",
  age: 25,
};
getValue(valueTest, "name");

//  ******************面试题19: TypeScript中类的理解 ******************
// 属性、方法、继承、构造函数、静态属性、静态方法、抽象类
abstract class abClass<T> {
  abstract testAb(value: T): T;
}
class sabClass<T> extends abClass<T> {
  testAb(value: T): T {
    return value;
  }
}

// ******************面试题20: TypeScript的内置数据类型有哪些 ******************
// string, number, boolean, undefined, null, void, array, tuple, enum, any, unknown, objet, never..

// ******************面试题21: TypeScript的映射文件 ******************
// sourcemap文件，用于将编译后的JavaScript代码与其对应的Typescript关联起来，通常用于调试，查看原始代码，断点调试，错误定位 sourceMap: true

// ******************面试题22: Typescript中never 和 void 的区别 ******************
function voidNever_0(): void {
  return undefined;
}
function voidNever_1(): void {
  //   return null; // Type 'null' is not assignable to type 'void'
}
// const voidNever_2: void = null;  // Type 'null' is not assignable to type 'void'
const voidNever_3: void = undefined;

// ******************面试题23: TypeScript 中的 getter/setter 是什么？你如何使用它们 ******************
// 在TypeScript中，getter和setter是类的访问器方法，用于控制对类属性的读取和写入操作。提供了一种更加安全和灵活的方式访问属性，而不是暴露属性本身
// getter: 返回属性本身，读书属性时会自动调用这个方法
// setter：函数不能标注返回值，包括void，设置属性时，自动调用这个方法
// 属性前加下划线
// 需要成对出现，如果只设置了getter，会变成只读属性 Cannot assign to 'fullName' because it is a read-only property.
class Employee {
  private _fullName = "";
  get fullName(): string {
    console.log("get fullName");
    return this._fullName;
  }
  set fullName(value: string) {
    if (value.length > 10) {
      console.log("your name is too long");
    } else {
      this._fullName = value;
    }
  }
}

let employee = new Employee();
employee.fullName = "employee";
console.log(employee.fullName); // get fullName employee
employee.fullName = "employee+++++++++"; // your name is too long
console.log(employee.fullName); // get fullName employee

// ******************面试题24: TypeScript中的构造函数是必须写出来的吗 ******************
// 在 TypeScript 中，构造函数（constructor）不是必须显式写出来的。
// 如果你不定义构造函数，TypeScript 会提供一个默认的无参构造函数。这在类中没有特殊初始化逻辑或需要默认行为的情况下是足够的

// ******************面试题25: Typescript中什么是装饰器，它们可以应用于什么 ******************
// 装饰器是一种特殊语法，用于为类，方法，属性，访问器或者参数添加元数据或者修改行为
// 类装饰器，在类声明之前使用装饰器，可以用于控制类的生成，类的属性访问
// 延伸：在TypeScript中，Function 是一个内置的全局类型，用于表示所有的函数类型。而小写的 function 并不是有效的类型标识符
// 延伸：装饰器可以组合使用，按照从内到外的顺序执行。

function classDecorator(target: Function) {
  console.log(`ClassDecorator applied on ${target.name}`);
  target.prototype.greet = function () {
    console.log(`Hello ${target.name}`);
  };
}
@classDecorator
class ClassDecorator {} //这行代码已经会调用classDecorator装饰器了，所以会打印`ClassDecorator applied on ${target.name}`
let classDecoratorObj = new ClassDecorator();
(classDecoratorObj as any).greet();

// 方法装饰器
// target:类的原型对象 MyClassWithMethod.prototype
// propertyKey: 被修饰的方法名：myMethod
// descriptor: 被修饰方法的PropertyDescriptor对象，PropertyDescriptor.value是方法的原始实现
function MethodDecorator(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log(`MethodDecorator applied on: ${propertyKey}`);
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log("MethodDecorator: before execution");
    const result = originalMethod.apply(this, args);
    console.log("MethodDecorator: after execution");
    return result;
  };
}

class MyClassWithMethod {
  @MethodDecorator
  myMethod() {
    console.log("Original method executed");
  }
} // MethodDecorator applied on: myMethod
console.log(MyClassWithMethod.prototype.myMethod);
// function (...args) {
//     console.log("MethodDecorator: before execution");
//     const result = originalMethod.apply(this, args);
//     console.log("MethodDecorator: after execution");
//     return result;
// }
const obj2 = new MyClassWithMethod();
obj2.myMethod();
// MethodDecorator: before execution
// Original method executed
// MethodDecorator: after execution

//访问器装饰器
function AccessorDecorator(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log(`AccessorDecorator applied on: ${propertyKey}`);
  const originalGetter = descriptor.get;
  const originalSetter = descriptor.set;
  descriptor.get = function () {
    console.log("AccessorDecorator: intercepting getter");
    return originalGetter ? originalGetter.call(this) : undefined;
  };
  descriptor.set = function (value) {
    console.log("AccessorDecorator: intercepting setter");
    return originalSetter ? originalSetter.call(this, value) : undefined;
  };
}

class MyClassWithAccessor {
  private _value: number = 42;

  @AccessorDecorator // getter或者setter上写一个就好
  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }
}

const obj3 = new MyClassWithAccessor();
obj3.value = 100;
console.log(obj3.value);
/*
输出：
AccessorDecorator applied on: value
AccessorDecorator: intercepting setter 
AccessorDecorator: intercepting getter
100
*/

// 属性装饰器
function PropertyDecorator(target: Object, propertyKey: string) {
  console.log(`PropertyDecorator applied on: ${propertyKey}`);
}

class MyClassWithProperty {
  @PropertyDecorator
  myProperty: string = "Hello, Property!";
}

const obj4 = new MyClassWithProperty();
/* 输出：
PropertyDecorator applied on: myProperty
*/

// 参数装饰器
// 延伸： 参数装饰器本身不能直接修改参数的值。
// 原因是参数装饰器仅在类定义阶段执行，而方法的参数值是在运行时由调用者提供的。参数装饰器主要用于元数据的注入或记录参数信息，而非直接操作参数值。
function ParameterDecorator(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  console.log(
    `ParameterDecorator applied on: ${String(propertyKey)}, parameterIndex: ${parameterIndex}`
  );
}

class MyClassWithParameters {
  myMethod(
    @ParameterDecorator param1: string,
    @ParameterDecorator param2: number
  ) {
    console.log(`Method executed with params: ${param1}, ${param2}`);
  }
}

const obj5 = new MyClassWithParameters();
obj5.myMethod("Hello", 42);
/*
输出：
ParameterDecorator applied on: myMethod, parameterIndex: 0
ParameterDecorator applied on: myMethod, parameterIndex: 1
Method executed with params: Hello, 42
*/

// ******************面试题25: 解释如何使用 TypeScript mixin ******************
// mixin是一种将多个类的功能整合到一个类中的模式，他允许将功能混入一个类而不使用传统的继承，Mixin通过组合多个类的行为解决单一继承的局限性
// 使用步骤：定义一个基础类 定义Mixin函数（接收一个基类并返回一个类） 使用extends关键字将Mixin应用于其他类
function Loggable<T extends { new (...args: any[]): {} }>(Base: T) {
  return class extends Base {
    log(message: string) {
      console.log(`[LOG] ${message}`);
    }
  };
}
function Timestampd<T extends { new (...args: any[]): {} }>(Base: T) {
  return class extends Base {
    getTimeStamp() {
      console.log(`Current timeStamp is ${new Date().toISOString()}`);
    }
  };
}
class BaseClass {
  greet(): void {
    console.log("Hello");
  }
}
class ExtendedClass extends Timestampd(Loggable(BaseClass)) {}
let extendedClass: ExtendedClass = new ExtendedClass();
extendedClass.log("testLog"); // "[LOG] testLog"
extendedClass.getTimeStamp(); //"Current timeStamp is 2024-11-22T02:12:24.410Z"
extendedClass.greet(); //"Hello"

// ******************面试题25: TypeScript支持的访问修饰符有哪些 ******************
// public: 类的所有成员，其子类以及该类的所有实例都能访问
// protected：该类以及子类的所有成员都能访问，但是实例不能访问
// private：只有该类的成员能够访问

// ******************面试题26: 如何判断入参的参数是否为一个数组 ******************
function testArray_0(x: unknown) {
  if (Array.isArray(x)) {
    console.log(x.length);
  }
}

// ******************面试题26: 如何定义一个数组，它的元素可能是字符串类型，也可能是数值类型？******************
// 延伸：typeof arr => object
const arr_0: (string | number)[] = [1, 2, "string"];
const arr_1: Array<string | number> = [1, 2, "string"];
