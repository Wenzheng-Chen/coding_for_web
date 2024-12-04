// main.js
console.log('执行 main.js');
const moduleA = require('./moduleA');
const moduleB = require('./moduleB');

moduleA.printValueB();
moduleB.printValueA();

console.log('在 main.js 中，moduleA.valueA =', moduleA.valueA);
console.log('在 main.js 中，moduleB.valueB =', moduleB.valueB);
