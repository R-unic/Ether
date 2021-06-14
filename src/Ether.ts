import { error, log } from "console";
import { readFileSync } from "fs";
import { exit } from "process";
import { Lexer } from "./SyntaxAnalysis/Lexer";
import { Token } from "./SyntaxAnalysis/Token";
import { Input } from "./Util";
import * as repl from "repl";

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

    public static Report(line: number, where: string, message: string) {
        error(`[line ${line}] Error${where}: ${message}`);
        this.hadError = true;
    }

    public static Error(line: number, message: string) {
        this.Report(line, "", message);
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

        for (const token of tokens)
            log(token.ToString());
    }
}
