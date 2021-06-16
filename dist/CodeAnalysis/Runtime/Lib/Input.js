"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputMethod = void 0;
const Prompt_1 = require("../../../Utility/Prompt");
class InputMethod {
    Arity() {
        return 1;
    }
    Call(interpreter, [prompt = ""]) {
        return __awaiter(this, void 0, void 0, function* () {
            const answer = yield Prompt_1.Input(prompt);
            Prompt_1.REPL.close();
            return answer;
        });
    }
    ToString() {
        return "<native method>";
    }
}
exports.InputMethod = InputMethod;
