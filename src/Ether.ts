import { error, log } from "console";
import { readFileSync } from "fs";
import { exit } from "process";
import { Lexer } from "./SyntaxAnalysis/Lexer";
import { Token } from "./SyntaxAnalysis/Token";
import { Input } from "./Util";
import { SyntaxType } from "./SyntaxAnalysis/Enumerations/SyntaxType";
import { Parser } from "./SyntaxAnalysis/Parser";
import { Expr } from "./SyntaxAnalysis/Expression";
import { ASTPrinter } from "./Utility/ASTPrinter";

export class Ether {
    private static hadError = false;

    public static Main(args: string[]): void {
        if (args.length > 1) {
            log("Usage: ether [script]");
            exit(64);
        } else if (args.length === 1)
            this.RunFile(args[0]);
        else
            this.RunPrompt();
    }

    public static Report(line: number, where: string, message: string): void {
        error(`[line ${line}] Error${where}: ${message}`);
        this.hadError = true;
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
    }

    public static Run(sourceCode: string): void {
        const lexer = new Lexer(sourceCode);
        const tokens: Token[] = lexer.ScanTokens();

        const parser = new Parser(tokens);
        const expr: Expr.Base | undefined = parser.Parse();

        if (this.hadError)
            return;

        const printer = new ASTPrinter;
        printer.Print(expr);
    }
}
