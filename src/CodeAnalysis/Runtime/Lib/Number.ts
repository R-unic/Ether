import { Callable } from "../Callable";
import { Interpreter } from "../Interpreter";

export class NumberMethod implements Callable {
    public Arity(): number {
        return 1;
    }

    public Call(interpreter: Interpreter, [ value ]: unknown[]): number | undefined {
        if (value === undefined || value === null)
            return undefined;

        if (typeof value === "number")
            return value;

        if (typeof value === "string")
            return parseFloat(value);

        if (value === true)
            return 1;
        else if (value === false)
            return 0;
    }

    public ToString(): string {
        return "<native method>";
    }
}