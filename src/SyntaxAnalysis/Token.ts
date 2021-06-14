import { SyntaxType } from "./Enumerations/TokenType";

export class Token {
    public constructor(
        public readonly Type: SyntaxType,
        public readonly Lexeme: string,
        public readonly Literal: any,
        public readonly Line: number
    ) {}

    public ToString(): string {
        return `Token(${SyntaxType[this.Type]}, Lexeme: "${this.Lexeme}", Value: ${this.Literal})`;
    }
}