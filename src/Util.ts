import { stdin, stdout } from "process"
import { createInterface, Interface } from "readline"

let rl: Interface = createInterface({
    input: stdin,
    output: stdout
});

export const Input = (prompt: string, callback: (result: string) => void): void =>
    rl.question(prompt, received => callback(received));