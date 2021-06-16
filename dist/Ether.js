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
exports.Ether = void 0;
const console_1 = require("console");
const safe_1 = require("colors/safe");
const fs_1 = require("fs");
const process_1 = require("process");
const SyntaxType_1 = require("./CodeAnalysis/Syntax/SyntaxType");
const Parser_1 = require("./CodeAnalysis/Syntax/Parser");
const Interpreter_1 = require("./CodeAnalysis/Runtime/Interpreter");
const Prompt_1 = require("./Utility/Prompt");
class Ether {
    static Main(args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.Args = args;
            if (args.length = 1)
                this.RunFile(args[0]);
            else {
                console_1.log("Welcome to the " + safe_1.rainbow("Ether") + " REPL!");
                yield this.RunPrompt();
            }
        });
    }
    static RaiseError(tokenOrLine, message) {
        console_1.error(safe_1.red(`[line ${typeof tokenOrLine === "number" ? tokenOrLine : tokenOrLine.Line}] Raised Error: ${message}`));
        this.HadError = true;
    }
    static RuntimeError(err) {
        var _a, _b;
        console_1.error(safe_1.red(`[line ${(_b = (_a = err.Token) === null || _a === void 0 ? void 0 : _a.Line) !== null && _b !== void 0 ? _b : "?"}] RuntimeError: ${err.message}`));
        this.HadRuntimeError = true;
    }
    static Error(tokenOrLine, message) {
        if (typeof tokenOrLine === "number")
            this.Report(tokenOrLine, "", message);
        else if (tokenOrLine.Type === SyntaxType_1.SyntaxType.EOF)
            this.Report(tokenOrLine.Line, " at end", message);
        else
            this.Report(tokenOrLine.Line, ` at '${tokenOrLine.Lexeme}'`, message);
    }
    static Report(line, where, message) {
        console_1.error(safe_1.red(`[line ${line}] Error${where}: ${message}`));
        this.HadError = true;
    }
    static RunPrompt() {
        return __awaiter(this, void 0, void 0, function* () {
            const line = yield Prompt_1.Input(safe_1.green("Ether » "));
            if (line === "")
                return yield this.RunPrompt();
            if (!line)
                Prompt_1.REPL.close();
            if (line === "#exit")
                Prompt_1.REPL.close();
            this.Run(line, true);
            this.HadError = false;
            yield this.RunPrompt();
        });
    }
    static RunFile(path) {
        const fileContents = fs_1.readFileSync(path, "utf-8");
        this.Run(fileContents, false);
        if (this.HadError)
            process_1.exit(65);
        if (this.HadRuntimeError)
            process_1.exit(70);
        process_1.exit();
    }
    static Run(sourceCode, repl) {
        this.interpreter.Interpret(new Parser_1.Parser(sourceCode), repl);
    }
}
exports.Ether = Ether;
Ether.HadError = false;
Ether.HadRuntimeError = false;
Ether.Args = [];
Ether.interpreter = new Interpreter_1.Interpreter;
