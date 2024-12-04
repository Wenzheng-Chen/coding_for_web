// main.js
console.log('执行 main.js');
const moduleA = require('./moduleA');
const moduleB = require('./moduleB');

console.log('在 main.js 中, moduleA.valueA =', moduleA.valueA, moduleA.BInA);
console.log('在 main.js 中, moduleB.valueB =', moduleB.valueB, moduleB.BInA);
