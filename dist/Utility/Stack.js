"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
class Stack {
    constructor() {
        this.cache = [];
    }
    Push(value) {
        return this.cache.push(value) + 1;
    }
    Pop() {
        if (this.Size === 0)
            throw new Error("Stack underflow.");
        return this.cache.pop();
    }
    Peek(index = this.Size) {
        return this.Get(index);
    }
    Get(index) {
        return this.cache[index - 1];
    }
    get First() {
        return this.cache[0];
    }
    get Size() {
        return this.cache.length;
    }
    get Empty() {
        return this.Size === 0;
    }
}
exports.Stack = Stack;
