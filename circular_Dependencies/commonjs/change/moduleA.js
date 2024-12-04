// moduleA.js
console.log('执行 moduleA');
const moduleB = require('./moduleB');

module.exports.valueA = 'A';

module.exports.printValueB = function() {
  console.log('在 moduleA 中，moduleB.valueB =', moduleB.valueB);
};
