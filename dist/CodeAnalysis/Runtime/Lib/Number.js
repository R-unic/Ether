"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberMethod = void 0;
class NumberMethod {
    Arity() {
        return 1;
    }
    Call(interpreter, [value]) {
        if (value === undefined || value === null)
            return undefined;
        if (typeof value === "number")
            return value;
        if (typeof value === "string")
            return parseFloat(value);
        if (value === true)
            return 1;
        else if (value === false)
            return 0;
    }
    ToString() {
        return "<native method>";
    }
}
exports.NumberMethod = NumberMethod;
