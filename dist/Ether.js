"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ether = void 0;
const console_1 = require("console");
const fs_1 = require("fs");
const process_1 = require("process");
const Lexer_1 = require("./SyntaxAnalysis/Lexer");
const Util_1 = require("./Util");
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
    static Error(line, message) {
        this.Report(line, "", message);
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
        for (const token of tokens)
            console_1.log(token.ToString());
    }
}
exports.Ether = Ether;
Ether.hadError = false;
