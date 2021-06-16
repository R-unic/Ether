"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanMethod = void 0;
class BooleanMethod {
    Arity() {
        return 1;
    }
    Call(interpreter, [value]) {
        return Boolean(value);
    }
    ToString() {
        return "<native method>";
    }
}
exports.BooleanMethod = BooleanMethod;
