import { Token } from "../Syntax/Token";
import { RuntimeError } from "./Interpreter";

export class Environment {
    private readonly values = new Map<string, unknown>();

    public constructor(
        public readonly Enclosing?: Environment
    ) {}

    public Assign(name: Token, value: unknown): void {
        if (this.values.has(name.Lexeme))          
            return this.Define(name.Lexeme, value);

        if (this.Enclosing !== undefined)
            return this.Enclosing.Assign(name, value);

        throw new RuntimeError(name, `Undefined variable '${name.Lexeme}'.`);
    }

    public Get(name: Token): unknown {
        if (this.values.has(name.Lexeme))
            return this.values.get(name.Lexeme);

        if (this.Enclosing !== undefined)
            return this.Enclosing.Get(name);

        throw new RuntimeError(name, `Undefined variable '${name.Lexeme}'.`);
    }

    public Define(name: string, value: unknown): void {
        this.values.set(name, value);
    }
}