// moduleB.js
console.log('执行 moduleB');
const moduleA = require('./moduleA');

module.exports.valueB = 'B';

module.exports.printValueA = function() {
  console.log('在 moduleB 中，moduleA.valueA =', moduleA.valueA);
};
