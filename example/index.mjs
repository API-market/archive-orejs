//const Orejs = require('../dist').Orejs
import { Orejs } from '../dist'
console.log("required", Orejs)

let orejs = new Orejs("hello")
console.log("instanced", orejs)

console.log("get", orejs.get())
