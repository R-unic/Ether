import { Stmt } from "../Syntax/Statement";
import { Callable } from "./Callable";
import { Environment } from "./Environment";
import { Interpreter, Return } from "./Interpreter";

export class Method implements Callable {
    public constructor(
        private readonly declaration: Stmt.Method,
        private readonly closure: Environment
    ) {}

    public Call(interpreter: Interpreter, args: unknown[]): unknown {
        const scope = new Environment(this.closure);
        for (let i = 0; i < this.declaration.Params.length; i++)
            scope.Define(this.declaration.Params[i].Lexeme, args[i]);

        try {
            interpreter.ExecuteBlock(this.declaration.Body, scope);
        } catch (returner) {
            return (returner as Return).Value;
        }
        return undefined;
    }

    public Arity(): number {
        return this.declaration.Params.length;
    }

    public ToString(): string {
        return `<method ${this.declaration.Name.Lexeme}>`;
    }
}