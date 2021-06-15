import { Interpreter } from "./Interpreter";

export abstract class Callable {
    public abstract Call(interpreter: Interpreter, args: unknown[]): unknown;
    public abstract Arity(): number;
    public abstract ToString(): string;
}