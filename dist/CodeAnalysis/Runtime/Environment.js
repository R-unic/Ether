"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const Interpreter_1 = require("./Interpreter");
class Environment {
    constructor(Enclosing) {
        this.Enclosing = Enclosing;
        this.Values = new Map();
    }
    Assign(name, value) {
        if (this.Values.has(name.Lexeme))
            return this.Define(name.Lexeme, value);
        if (this.Enclosing !== undefined)
            return this.Enclosing.Assign(name, value);
        throw new Interpreter_1.RuntimeError(name, `Undefined variable '${name.Lexeme}'.`);
    }
    AssignAt(distance, name, value) {
        this.Ancestor(distance).Values.set(name.Lexeme, value);
    }
    Get(name) {
        if (this.Values.has(name.Lexeme))
            return this.Values.get(name.Lexeme);
        if (this.Enclosing !== undefined)
            return this.Enclosing.Get(name);
        throw new Interpreter_1.RuntimeError(name, `Undefined variable '${name.Lexeme}'.`);
    }
    GetAt(distance, name) {
        return this.Ancestor(distance).Values.get(name);
    }
    Define(name, value) {
        this.Values.set(name, value);
    }
    Ancestor(distance) {
        let env = this;
        for (let i = 0; i < distance; i++)
            env = env.Enclosing;
        return env;
    }
}
exports.Environment = Environment;
