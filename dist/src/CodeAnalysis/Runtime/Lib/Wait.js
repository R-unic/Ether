"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitMethod = void 0;
class WaitMethod {
    Arity() {
        return 1;
    }
    Call(interpreter, [seconds]) {
        const date = Date.now();
        let currentDate;
        do {
            currentDate = Date.now();
        } while (currentDate - date < seconds * 1000);
    }
    ToString() {
        return "<native method>";
    }
}
exports.WaitMethod = WaitMethod;
