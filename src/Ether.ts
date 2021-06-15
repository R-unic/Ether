import { error, log } from "console";
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
            log("Usage: ether [script]");
            exit(64);
        } else if (args.length === 1)
            this.RunFile(args[0]);
        else
            this.RunPrompt();
    }

    public static RuntimeError(error: RuntimeError) {
        log(error.message + `\n[line ${error.Token.Line}]`);
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
        error(`[line ${line}] Error${where}: ${message}`);
        this.hadError = true;
    }

    public static RunPrompt(): void {
        Input("Ether » ", line => {
            if (!line || line === "")
                return;

            this.Run(line);
            this.hadError = false;
            this.RunPrompt();
        });
    }

    public static RunFile(path: string): void {
        const fileContents = readFileSync(path, "utf-8");
        this.Run(fileContents);

        if (this.hadError)
            exit(65);

        if (this.hadRuntimeError)
            exit(70);
    }

    public static Run(sourceCode: string): void {
        const lexer = new Lexer(sourceCode);
        const tokens: Token[] = lexer.LexTokens();

        const parser = new Parser(tokens);
        const statements: Stmt.Statement[] = parser.Parse();

        if (this.hadError)
            return;

        this.interpreter.Interpret(statements);
    }
}