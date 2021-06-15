import { yellow } from "colors/safe";
import { log } from "console";
import { Callable } from "../Callable";
import { Interpreter } from "../Interpreter";

export class WarnMethod implements Callable {
    public Arity(): number {
        return 1;
    }

    public Call(interpreter: Interpreter, [ message ]: unknown[]): void {
        log(yellow("Warning: "), interpreter.GetStyling(message));
    }

    public ToString(): string {
        return "<native method>";
    }
}
