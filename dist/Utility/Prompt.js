"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.REPL = void 0;
const readline_1 = require("readline");
exports.REPL = (0, readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout
});
async function Input(message) {
    return new Promise((resolve, reject) => exports.REPL.question(message, resolve));
}
exports.Input = Input;
