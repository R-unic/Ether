"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keywords = void 0;
const SyntaxType_1 = require("./SyntaxType");
exports.Keywords = new Map(Object.entries({
    "break": SyntaxType_1.SyntaxType.BREAK,
    "const": SyntaxType_1.SyntaxType.CONST,
    "continue": SyntaxType_1.SyntaxType.CONTINUE,
    "else": SyntaxType_1.SyntaxType.ELSE,
    "false": SyntaxType_1.SyntaxType.FALSE,
    "for": SyntaxType_1.SyntaxType.FOR,
    "global": SyntaxType_1.SyntaxType.GLOBAL,
    "if": SyntaxType_1.SyntaxType.IF,
    "let": SyntaxType_1.SyntaxType.LET,
    "method": SyntaxType_1.SyntaxType.METHOD,
    "null": SyntaxType_1.SyntaxType.NULL,
    "print": SyntaxType_1.SyntaxType.PRINT,
    "private": SyntaxType_1.SyntaxType.PRIVATE,
    "public": SyntaxType_1.SyntaxType.PUBLIC,
    "raise": SyntaxType_1.SyntaxType.RAISE,
    "return": SyntaxType_1.SyntaxType.RETURN,
    "super": SyntaxType_1.SyntaxType.SUPER,
    "static": SyntaxType_1.SyntaxType.STATIC,
    "this": SyntaxType_1.SyntaxType.THIS,
    "true": SyntaxType_1.SyntaxType.TRUE,
    "while": SyntaxType_1.SyntaxType.WHILE,
}));
