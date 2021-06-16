"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringMethod = void 0;
class StringMethod {
    Arity() {
        return 1;
    }
    Call(interpreter, [value]) {
        return interpreter.Stringify(value);
    }
    ToString() {
        return "<native method>";
    }
}
exports.StringMethod = StringMethod;
