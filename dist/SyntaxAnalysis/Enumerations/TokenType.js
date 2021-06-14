"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxType = void 0;
var SyntaxType;
(function (SyntaxType) {
    // Single-character tokens.
    SyntaxType[SyntaxType["LEFT_PAREN"] = 0] = "LEFT_PAREN";
    SyntaxType[SyntaxType["RIGHT_PAREN"] = 1] = "RIGHT_PAREN";
    SyntaxType[SyntaxType["LEFT_BRACE"] = 2] = "LEFT_BRACE";
    SyntaxType[SyntaxType["RIGHT_BRACE"] = 3] = "RIGHT_BRACE";
    SyntaxType[SyntaxType["COMMA"] = 4] = "COMMA";
    SyntaxType[SyntaxType["DOT"] = 5] = "DOT";
    SyntaxType[SyntaxType["MINUS"] = 6] = "MINUS";
    SyntaxType[SyntaxType["PLUS"] = 7] = "PLUS";
    SyntaxType[SyntaxType["SEMICOLON"] = 8] = "SEMICOLON";
    SyntaxType[SyntaxType["SLASH"] = 9] = "SLASH";
    SyntaxType[SyntaxType["STAR"] = 10] = "STAR";
    // One or two character tokens.
    SyntaxType[SyntaxType["BANG"] = 11] = "BANG";
    SyntaxType[SyntaxType["BANG_EQUAL"] = 12] = "BANG_EQUAL";
    SyntaxType[SyntaxType["EQUAL"] = 13] = "EQUAL";
    SyntaxType[SyntaxType["EQUAL_EQUAL"] = 14] = "EQUAL_EQUAL";
    SyntaxType[SyntaxType["GREATER"] = 15] = "GREATER";
    SyntaxType[SyntaxType["GREATER_EQUAL"] = 16] = "GREATER_EQUAL";
    SyntaxType[SyntaxType["LESS"] = 17] = "LESS";
    SyntaxType[SyntaxType["LESS_EQUAL"] = 18] = "LESS_EQUAL";
    // Literals.
    SyntaxType[SyntaxType["IDENTIFIER"] = 19] = "IDENTIFIER";
    SyntaxType[SyntaxType["STRING"] = 20] = "STRING";
    SyntaxType[SyntaxType["NUMBER"] = 21] = "NUMBER";
    // Keywords.
    SyntaxType[SyntaxType["AND"] = 22] = "AND";
    SyntaxType[SyntaxType["CLASS"] = 23] = "CLASS";
    SyntaxType[SyntaxType["ELSE"] = 24] = "ELSE";
    SyntaxType[SyntaxType["FALSE"] = 25] = "FALSE";
    SyntaxType[SyntaxType["METHOD"] = 26] = "METHOD";
    SyntaxType[SyntaxType["FOR"] = 27] = "FOR";
    SyntaxType[SyntaxType["IF"] = 28] = "IF";
    SyntaxType[SyntaxType["NULL"] = 29] = "NULL";
    SyntaxType[SyntaxType["OR"] = 30] = "OR";
    SyntaxType[SyntaxType["PRINT"] = 31] = "PRINT";
    SyntaxType[SyntaxType["RETURN"] = 32] = "RETURN";
    SyntaxType[SyntaxType["SUPER"] = 33] = "SUPER";
    SyntaxType[SyntaxType["THIS"] = 34] = "THIS";
    SyntaxType[SyntaxType["TRUE"] = 35] = "TRUE";
    SyntaxType[SyntaxType["LET"] = 36] = "LET";
    SyntaxType[SyntaxType["WHILE"] = 37] = "WHILE";
    SyntaxType[SyntaxType["EOF"] = 38] = "EOF";
})(SyntaxType = exports.SyntaxType || (exports.SyntaxType = {}));
