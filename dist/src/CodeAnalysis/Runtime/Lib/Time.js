"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeMethod = void 0;
class TimeMethod {
    Arity() {
        return 0;
    }
    Call(interpreter, args) {
        return Math.round(Date.now() / 1000);
    }
    ToString() {
        return "<native method>";
    }
}
exports.TimeMethod = TimeMethod;
