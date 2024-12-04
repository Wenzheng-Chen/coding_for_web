// moduleB.js
console.log('执行 moduleB');
const moduleA = require('./moduleA');
console.log("Test moduleA in B", moduleA);

module.exports.valueB = 'B';
module.exports.AInB = moduleA;
console.log('在 moduleB 中, moduleA.valueA =', moduleA.valueA);
