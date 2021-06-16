import { Input, REPL } from "../../../Utility/Prompt";
import { Callable } from "../Callable";
import { Interpreter } from "../Interpreter";

export class InputMethod implements Callable {
    public Arity(): number {
        return 1;
    }

    public async Call(interpreter: Interpreter, [ prompt = "" ]: unknown[]): Promise<string> {
        const answer = await Input(prompt as string);
        REPL.close();
        return answer;
    }

    public ToString(): string {
        return "<native method>";
    }
}