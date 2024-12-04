// moduleA.js
console.log("执行 moduleA");
const moduleB = require("./moduleB");
console.log("Test moduleB in A", moduleB);

module.exports.valueA = "A";
module.exports.BInA = moduleB;
console.log("在 moduleA 中, moduleB.valueB =", moduleB.valueB);
