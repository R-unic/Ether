"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputMethod = void 0;
const Prompt_1 = require("../../../Utility/Prompt");
class InputMethod {
    Arity() {
        return 1;
    }
    async Call(interpreter, [prompt = ""]) {
        const answer = await (0, Prompt_1.Input)(prompt);
        Prompt_1.REPL.close();
        return answer;
    }
    ToString() {
        return "<native method>";
    }
}
exports.InputMethod = InputMethod;
