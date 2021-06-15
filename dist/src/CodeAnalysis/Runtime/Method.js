"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
const Environment_1 = require("./Environment");
class Method {
    constructor(declaration, closure) {
        this.declaration = declaration;
        this.closure = closure;
    }
    Call(interpreter, args) {
        const scope = new Environment_1.Environment(this.closure);
        for (let i = 0; i < this.declaration.Params.length; i++)
            scope.Define(this.declaration.Params[i].Lexeme, args[i]);
        interpreter.ExecuteBlock(this.declaration.Body, scope);
        return undefined;
    }
    Arity() {
        return this.declaration.Params.length;
    }
    ToString() {
        return `<method ${this.declaration.Name.Lexeme}>`;
    }
}
exports.Method = Method;
