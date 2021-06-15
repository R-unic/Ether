import { Callable } from "../Callable";
import { Interpreter } from "../Interpreter";

export class TimeMethod implements Callable {
    public Arity(): number {
        return 0;
    }

    public Call(interpreter: Interpreter, args: unknown[]): number {
        return Math.round(Date.now() / 1000);
    }

    public ToString(): string {
        return "<native method>";
    }
}
