import { Callable } from "../Callable";
import { Interpreter } from "../Interpreter";

export class StringMethod implements Callable {
    public Arity(): number {
        return 1;
    }

    public Call(interpreter: Interpreter, [ value ]: unknown[]): string | undefined {
        return interpreter.Stringify(value);
    }

    public ToString(): string {
        return "<native method>";
    }
}