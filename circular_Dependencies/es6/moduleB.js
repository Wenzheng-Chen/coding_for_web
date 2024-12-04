// moduleB.js
console.log('Executing moduleB');
import { valueA, getValueA } from './moduleA.js';

export const valueB = 'B';
export function getValueB() {
  return valueB;
}

export function logValueA() {
  console.log('In moduleB, valueA:', valueA);
  console.log('In moduleB, getValueA():', getValueA());
}
