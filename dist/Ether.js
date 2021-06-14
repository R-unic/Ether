"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ether = void 0;
const console_1 = require("console");
const fs_1 = require("fs");
const process_1 = require("process");
const Lexer_1 = require("./SyntaxAnalysis/Lexer");
const Util_1 = require("./Util");
const SyntaxType_1 = require("./SyntaxAnalysis/Enumerations/SyntaxType");
const Parser_1 = require("./SyntaxAnalysis/Parser");
const ASTPrinter_1 = require("./Utility/ASTPrinter");
class Ether {
    static Main(args) {
        if (args.length > 1) {
            console_1.log("Usage: ether [script]");
            process_1.exit(64);
        }
        else if (args.length === 1)
            this.RunFile(args[0]);
        else
            this.RunPrompt();
    }
    static Report(line, where, message) {
        console_1.error(`[line ${line}] Error${where}: ${message}`);
        this.hadError = true;
    }
    static Error(tokenOrLine, message) {
        if (typeof tokenOrLine === "number")
            this.Report(tokenOrLine, "", message);
        else if (tokenOrLine.Type === SyntaxType_1.SyntaxType.EOF)
            this.Report(tokenOrLine.Line, " at end", message);
        else
            this.Report(tokenOrLine.Line, ` at '${tokenOrLine.Lexeme}'`, message);
    }
    static RunPrompt() {
        Util_1.Input("Ether » ", line => {
            if (!line || line === "")
                return;
            this.Run(line);
            this.hadError = false;
            this.RunPrompt();
        });
    }
    static RunFile(path) {
        const fileContents = fs_1.readFileSync(path, "utf-8");
        this.Run(fileContents);
        if (this.hadError)
            process_1.exit(65);
    }
    static Run(sourceCode) {
        const lexer = new Lexer_1.Lexer(sourceCode);
        const tokens = lexer.ScanTokens();
        const parser = new Parser_1.Parser(tokens);
        const expr = parser.Parse();
        if (this.hadError)
            return;
        const printer = new ASTPrinter_1.ASTPrinter;
        printer.Print(expr);
    }
}
exports.Ether = Ether;
Ether.hadError = false;
