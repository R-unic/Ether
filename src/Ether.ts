import { error, log } from "console";
import { yellow, red, green, rainbow } from "colors/safe";
import { readFileSync } from "fs";
import { exit } from "process";
import { Input } from "./Util";
import { Lexer } from "./CodeAnalysis/Syntax/Lexer";
import { Token } from "./CodeAnalysis/Syntax/Token";
import { SyntaxType } from "./CodeAnalysis/Syntax/SyntaxType";
import { Parser } from "./CodeAnalysis/Syntax/Parser";
import { Interpreter, RuntimeError } from "./CodeAnalysis/Runtime/Interpreter";
import { Stmt } from "./CodeAnalysis/Syntax/Statement";

export class Ether {
    private static readonly interpreter = new Interpreter;
    private static hadError = false;
    private static hadRuntimeError = false;

    public static Main(args: string[]): void {
        if (args.length > 1) {
            log(yellow("Usage: ether [script]"));
            exit(64);
        } else if (args.length === 1)
            this.RunFile(args[0]);
        else {
            log("Welcome to the " + rainbow("Ether") + " REPL!")
            this.RunPrompt();
        }
    }
    
    public static RaiseError(tokenOrLine: Token | number, message: string): void {
        error(red(`[line ${typeof tokenOrLine === "number" ? tokenOrLine : tokenOrLine.Line}] Raised Error: ${message}`));
        this.hadError = true;
    }

    public static RuntimeError(err: RuntimeError): void {
        error(red(`[line ${err.Token?.Line?? "?"}] RuntimeError: ${err.message}`));
        this.hadRuntimeError = true;
    }

    public static Error(tokenOrLine: Token | number, message: string): void {
        if (typeof tokenOrLine === "number")
            this.Report(tokenOrLine, "", message);
        else
            if (tokenOrLine.Type === SyntaxType.EOF)
                this.Report(tokenOrLine.Line, " at end", message);
            else
                this.Report(tokenOrLine.Line, ` at '${tokenOrLine.Lexeme}'`, message);
    }

    public static Report(line: number, where: string, message: string): void {
        error(red(`[line ${line}] Error${where}: ${message}`));
        this.hadError = true;
    }

    public static RunPrompt(): void {
        Input(green("Ether » "), line => {
            if (!line || line === "")
                return;

            this.Run(line, true);
            this.hadError = false;
            this.RunPrompt();
        });
    }

    public static RunFile(path: string): void {
        const fileContents = readFileSync(path, "utf-8");
        this.Run(fileContents, false);

        if (this.hadError)
            exit(65);

        if (this.hadRuntimeError)
            exit(70);

        exit();
    }

    public static Run(sourceCode: string, repl: boolean): void {
        const lexer = new Lexer(sourceCode);
        const tokens: Token[] = lexer.LexTokens();

        const parser = new Parser(tokens);
        const statements: Stmt.Statement[] = parser.Parse();

        if (this.hadError)
            return;

        this.interpreter.Interpret(parser, statements, repl);
    }
}