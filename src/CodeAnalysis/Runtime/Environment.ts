import { Token } from "../Syntax/Token";
import { RuntimeError } from "./Interpreter";

export class Environment {
    public readonly Values = new Map<string, unknown>();

    public constructor(
        public readonly Enclosing?: Environment
    ) {}

    public Assign(name: Token, value: unknown): void {
        if (this.Values.has(name.Lexeme))          
            return this.Define(name.Lexeme, value);

        if (this.Enclosing !== undefined)
            return this.Enclosing.Assign(name, value);

        throw new RuntimeError(name, `Undefined variable '${name.Lexeme}'.`);
    }

    public AssignAt(distance: number, name: Token, value: unknown): void {
        this.Ancestor(distance).Values.set(name.Lexeme, value);
    }

    public Get(name: Token): unknown {
        if (this.Values.has(name.Lexeme))
            return this.Values.get(name.Lexeme);

        if (this.Enclosing !== undefined)
            return this.Enclosing.Get(name);

        throw new RuntimeError(name, `Undefined variable '${name.Lexeme}'.`);
    }

    public GetAt(distance: number, name: string): unknown {
        return this.Ancestor(distance).Values.get(name);
    }

    public Define(name: string, value: unknown): void {
        this.Values.set(name, value);
    }

    public Ancestor(distance: number): Environment {
        let env: Environment = this;
        for (let i = 0; i < distance; i++)
            env = env.Enclosing as Environment;

        return env;
    }
}