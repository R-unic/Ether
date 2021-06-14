"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keywords = void 0;
const SyntaxType_1 = require("./Enumerations/SyntaxType");
exports.Keywords = new Map(Object.entries({
    "else": SyntaxType_1.SyntaxType.ELSE,
    "false": SyntaxType_1.SyntaxType.FALSE,
    "for": SyntaxType_1.SyntaxType.FOR,
    "method": SyntaxType_1.SyntaxType.METHOD,
    "if": SyntaxType_1.SyntaxType.IF,
    "let": SyntaxType_1.SyntaxType.LET,
    "null": SyntaxType_1.SyntaxType.NULL,
    "print": SyntaxType_1.SyntaxType.PRINT,
    "return": SyntaxType_1.SyntaxType.RETURN,
    "super": SyntaxType_1.SyntaxType.SUPER,
    "this": SyntaxType_1.SyntaxType.THIS,
    "true": SyntaxType_1.SyntaxType.TRUE,
    "while": SyntaxType_1.SyntaxType.WHILE,
}));
