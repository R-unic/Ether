"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keywords = void 0;
const TokenType_1 = require("./Enumerations/TokenType");
exports.Keywords = new Map(Object.entries({
    "else": TokenType_1.SyntaxType.ELSE,
    "false": TokenType_1.SyntaxType.FALSE,
    "for": TokenType_1.SyntaxType.FOR,
    "method": TokenType_1.SyntaxType.METHOD,
    "if": TokenType_1.SyntaxType.IF,
    "let": TokenType_1.SyntaxType.LET,
    "null": TokenType_1.SyntaxType.NULL,
    "print": TokenType_1.SyntaxType.PRINT,
    "return": TokenType_1.SyntaxType.RETURN,
    "super": TokenType_1.SyntaxType.SUPER,
    "this": TokenType_1.SyntaxType.THIS,
    "true": TokenType_1.SyntaxType.TRUE,
    "while": TokenType_1.SyntaxType.WHILE,
}));
