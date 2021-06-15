import { Callable } from "../Callable";
import { Interpreter } from "../Interpreter";

export class WaitMethod implements Callable {
    public Arity(): number {
        return 1;
    }

    public Call(interpreter: Interpreter, [ seconds ]: unknown[]): void {
        const date = Date.now();
        let currentDate;
        do {
            currentDate = Date.now();
        } while (currentDate - date < (seconds as number) * 1000);
    }

    public ToString(): string {
        return "<native method>";
    }
}