import { SyntaxType as Syntax } from "./SyntaxType";

export const Keywords = new Map<string, Syntax>(Object.entries({
    "break": Syntax.BREAK,
    "const": Syntax.CONST,
    "continue": Syntax.CONTINUE,
    "else": Syntax.ELSE,
    "false": Syntax.FALSE,
    "for": Syntax.FOR,
    "method": Syntax.METHOD,
    "if": Syntax.IF,
    "let": Syntax.LET,
    "null": Syntax.NULL,
    "print": Syntax.PRINT,
    "raise": Syntax.RAISE,
    "return": Syntax.RETURN,
    "super": Syntax.SUPER,
    "this": Syntax.THIS,
    "true": Syntax.TRUE,
    "while": Syntax.WHILE,
}));