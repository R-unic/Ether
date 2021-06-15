"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const Interpreter_1 = require("./Interpreter");
class Environment {
    constructor(Enclosing) {
        this.Enclosing = Enclosing;
        this.values = new Map();
    }
    Assign(name, value) {
        if (this.values.has(name.Lexeme))
            return this.Define(name.Lexeme, value);
        if (this.Enclosing !== undefined)
            return this.Enclosing.Assign(name, value);
        throw new Interpreter_1.RuntimeError(name, `Undefined variable '${name.Lexeme}'.`);
    }
    Get(name) {
        if (this.values.has(name.Lexeme))
            return this.values.get(name.Lexeme);
        if (this.Enclosing !== undefined)
            return this.Enclosing.Get(name);
        throw new Interpreter_1.RuntimeError(name, `Undefined variable '${name.Lexeme}'.`);
    }
    Define(name, value) {
        this.values.set(name, value);
    }
}
exports.Environment = Environment;
