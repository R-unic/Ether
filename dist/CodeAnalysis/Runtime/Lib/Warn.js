"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarnMethod = void 0;
const safe_1 = require("colors/safe");
const console_1 = require("console");
class WarnMethod {
    Arity() {
        return 1;
    }
    Call(interpreter, [message]) {
        (0, console_1.log)((0, safe_1.yellow)("Warning: "), interpreter.GetStyling(message));
    }
    ToString() {
        return "<native method>";
    }
}
exports.WarnMethod = WarnMethod;
