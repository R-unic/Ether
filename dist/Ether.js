"use strict";
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
    static async Main(args) {
        this.Args = args;
        if (args.length == 1)
            this.RunFile(args[0]);
        else {
            (0, console_1.log)("Welcome to the " + (0, safe_1.rainbow)("Ether") + " REPL!");
            await this.RunPrompt();
        }
    }
    static RaiseError(tokenOrLine, message) {
        (0, console_1.error)((0, safe_1.red)(`[line ${typeof tokenOrLine === "number" ? tokenOrLine : tokenOrLine.Line}] Raised Error: ${message}`));
        this.HadError = true;
    }
    static RuntimeError(err) {
        (0, console_1.error)((0, safe_1.red)(`[line ${err.Token?.Line ?? "?"}] RuntimeError: ${err.message}`));
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
        (0, console_1.error)((0, safe_1.red)(`[line ${line + 1}] Error${where}: ${message}`));
        this.HadError = true;
    }
    static async RunPrompt() {
        const line = await (0, Prompt_1.Input)((0, safe_1.green)("Ether » "));
        if (line === "")
            return await this.RunPrompt();
        if (!line)
            Prompt_1.REPL.close();
        if (line === "#exit")
            Prompt_1.REPL.close();
        this.Run(line, true);
        this.HadError = false;
        await this.RunPrompt();
    }
    static RunFile(path) {
        const fileContents = (0, fs_1.readFileSync)(path, "utf-8");
        this.Run(fileContents, false);
        if (this.HadError)
            (0, process_1.exit)(65);
        if (this.HadRuntimeError)
            (0, process_1.exit)(70);
        (0, process_1.exit)();
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
