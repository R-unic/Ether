import { Callable } from "../Callable";
import { Interpreter } from "../Interpreter";

export class BooleanMethod implements Callable {
    public Arity(): number {
        return 1;
    }

    public Call(interpreter: Interpreter, [ value ]: unknown[]): boolean {
        return Boolean(value);
    }

    public ToString(): string {
        return "<native method>";
    }
}