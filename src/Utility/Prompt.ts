import { createInterface } from "readline";

export const REPL = createInterface({
    input: process.stdin,   
    output: process.stdout 
});

export async function Input(message: string): Promise<string> {  
    return new Promise<string>((resolve, reject) => 
        REPL.question(message, resolve)
    );
}