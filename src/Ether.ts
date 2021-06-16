import { error, log } from "console";
import { red, green, rainbow } from "colors/safe";
import { readFileSync } from "fs";
import { exit } from "process";
import { Token } from "./CodeAnalysis/Syntax/Token";
import { SyntaxType } from "./CodeAnalysis/Syntax/SyntaxType";
import { Parser } from "./CodeAnalysis/Syntax/Parser";
import { Interpreter, RuntimeError } from "./CodeAnalysis/Runtime/Interpreter";
import { Input, REPL } from "./Utility/Prompt";

export class Ether {
    public static HadError = false;
    public static HadRuntimeError = false;
    public static Args: string[] = [];
    
    private static readonly interpreter = new Interpreter;

    public static async Main(args: string[]): Promise<void> {
        this.Args = args;
        if (args.length = 1)
            this.RunFile(args[0]);
        else {
            log("Welcome to the " + rainbow("Ether") + " REPL!");
            await this.RunPrompt();
        }
    }
    
    public static RaiseError(tokenOrLine: Token | number, message: string): void {
        error(red(`[line ${typeof tokenOrLine === "number" ? tokenOrLine : tokenOrLine.Line}] Raised Error: ${message}`));
        this.HadError = true;
    }

    public static RuntimeError(err: RuntimeError): void {
        error(red(`[line ${err.Token?.Line?? "?"}] RuntimeError: ${err.message}`));
        this.HadRuntimeError = true;
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
        this.HadError = true;
    }

    public static async RunPrompt(): Promise<void> {
        const line = await Input(green("Ether » "));
        if (line === "")
            return await this.RunPrompt();

        if (!line)
            REPL.close();

        if (line === "#exit")
            REPL.close();

        this.Run(line, true);
        this.HadError = false;
        await this.RunPrompt();
    }

    public static RunFile(path: string): void {
        const fileContents = readFileSync(path, "utf-8");
        this.Run(fileContents, false);

        if (this.HadError)
            exit(65);

        if (this.HadRuntimeError)
            exit(70);

        exit();
    }

    public static Run(sourceCode: string, repl: boolean): void {
        this.interpreter.Interpret(new Parser(sourceCode), repl);
    }
}