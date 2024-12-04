// moduleA.js
console.log('Executing moduleA');
import { valueB, getValueB } from './moduleB.js';

export const valueA = 'A';
export function getValueA() {
  return valueA;
}

export function logValueB() {
  console.log('In moduleA, valueB:', valueB);
  console.log('In moduleA, getValueB():', getValueB());
}
