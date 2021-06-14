"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const process_1 = require("process");
const readline_1 = require("readline");
let rl = readline_1.createInterface({
    input: process_1.stdin,
    output: process_1.stdout
});
const Input = (prompt, callback) => rl.question(prompt, received => callback(received));
exports.Input = Input;
