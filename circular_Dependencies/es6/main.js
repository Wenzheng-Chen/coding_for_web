// main.js
import { valueA, getValueA, logValueB } from './moduleA.js';
import { valueB, getValueB, logValueA } from './moduleB.js';
logValueB();
logValueA();


console.log('In main.js, valueA:', valueA);
console.log('In main.js, valueB:', valueB);
console.log('In main.js, getValueA():', getValueA());
console.log('In main.js, getValueB():', getValueB());
