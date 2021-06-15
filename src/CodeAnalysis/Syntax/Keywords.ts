import { SyntaxType } from "./SyntaxType";

export const Keywords = new Map<string, SyntaxType>(Object.entries({
    "else": SyntaxType.ELSE,
    "false": SyntaxType.FALSE,
    "for": SyntaxType.FOR,
    "method": SyntaxType.METHOD,
    "if": SyntaxType.IF,
    "let": SyntaxType.LET,
    "null": SyntaxType.NULL,
    "print": SyntaxType.PRINT,
    "return": SyntaxType.RETURN,
    "super": SyntaxType.SUPER,
    "this": SyntaxType.THIS,
    "true": SyntaxType.TRUE,
    "while": SyntaxType.WHILE,
}));