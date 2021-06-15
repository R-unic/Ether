"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ether = void 0;
const console_1 = require("console");
const safe_1 = require("colors/safe");
const fs_1 = require("fs");
const process_1 = require("process");
const Util_1 = require("./Util");
const Lexer_1 = require("./CodeAnalysis/Syntax/Lexer");
const SyntaxType_1 = require("./CodeAnalysis/Syntax/SyntaxType");
const Parser_1 = require("./CodeAnalysis/Syntax/Parser");
const Interpreter_1 = require("./CodeAnalysis/Runtime/Interpreter");
class Ether {
    static Main(args) {
        if (args.length > 1) {
            console_1.log(safe_1.yellow("Usage: ether [script]"));
            process_1.exit(64);
        }
        else if (args.length === 1)
            this.RunFile(args[0]);
        else {
            console_1.log("Welcome to the " + safe_1.rainbow("Ether") + " REPL!");
            this.RunPrompt();
        }
    }
    static RaiseError(tokenOrLine, message) {
        console_1.error(safe_1.red(`[line ${typeof tokenOrLine === "number" ? tokenOrLine : tokenOrLine.Line}] Raised Error: ${message}`));
        this.hadError = true;
    }
    static RuntimeError(err) {
        var _a, _b;
        console_1.error(safe_1.red(`[line ${(_b = (_a = err.Token) === null || _a === void 0 ? void 0 : _a.Line) !== null && _b !== void 0 ? _b : "?"}] RuntimeError: ${err.message}`));
        this.hadRuntimeError = true;
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
        this.hadError = true;
    }
    static RunPrompt() {
        Util_1.Input(safe_1.green("Ether » "), line => {
            if (!line || line === "")
                return;
            this.Run(line, true);
            this.hadError = false;
            this.RunPrompt();
        });
    }
    static RunFile(path) {
        const fileContents = fs_1.readFileSync(path, "utf-8");
        this.Run(fileContents, false);
        if (this.hadError)
            process_1.exit(65);
        if (this.hadRuntimeError)
            process_1.exit(70);
        process_1.exit();
    }
    static Run(sourceCode, repl) {
        const lexer = new Lexer_1.Lexer(sourceCode);
        const tokens = lexer.LexTokens();
        const parser = new Parser_1.Parser(tokens);
        const statements = parser.Parse();
        if (this.hadError)
            return;
        this.interpreter.Interpret(parser, statements, repl);
    }
}
exports.Ether = Ether;
Ether.interpreter = new Interpreter_1.Interpreter;
Ether.hadError = false;
Ether.hadRuntimeError = false;
