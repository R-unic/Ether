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
    SyntaxType[SyntaxType["CARAT"] = 11] = "CARAT";
    SyntaxType[SyntaxType["PERCENT"] = 12] = "PERCENT";
    SyntaxType[SyntaxType["HASHTAG"] = 13] = "HASHTAG";
    // One or two character tokens.
    SyntaxType[SyntaxType["BANG"] = 14] = "BANG";
    SyntaxType[SyntaxType["BANG_EQUAL"] = 15] = "BANG_EQUAL";
    SyntaxType[SyntaxType["EQUAL"] = 16] = "EQUAL";
    SyntaxType[SyntaxType["EQUAL_EQUAL"] = 17] = "EQUAL_EQUAL";
    SyntaxType[SyntaxType["GREATER"] = 18] = "GREATER";
    SyntaxType[SyntaxType["GREATER_EQUAL"] = 19] = "GREATER_EQUAL";
    SyntaxType[SyntaxType["LESS"] = 20] = "LESS";
    SyntaxType[SyntaxType["LESS_EQUAL"] = 21] = "LESS_EQUAL";
    // Literals.
    SyntaxType[SyntaxType["IDENTIFIER"] = 22] = "IDENTIFIER";
    SyntaxType[SyntaxType["STRING"] = 23] = "STRING";
    SyntaxType[SyntaxType["NUMBER"] = 24] = "NUMBER";
    // Keywords.
    SyntaxType[SyntaxType["AND"] = 25] = "AND";
    SyntaxType[SyntaxType["CLASS"] = 26] = "CLASS";
    SyntaxType[SyntaxType["ELSE"] = 27] = "ELSE";
    SyntaxType[SyntaxType["FALSE"] = 28] = "FALSE";
    SyntaxType[SyntaxType["METHOD"] = 29] = "METHOD";
    SyntaxType[SyntaxType["FOR"] = 30] = "FOR";
    SyntaxType[SyntaxType["IF"] = 31] = "IF";
    SyntaxType[SyntaxType["NULL"] = 32] = "NULL";
    SyntaxType[SyntaxType["OR"] = 33] = "OR";
    SyntaxType[SyntaxType["PRINT"] = 34] = "PRINT";
    SyntaxType[SyntaxType["RETURN"] = 35] = "RETURN";
    SyntaxType[SyntaxType["SUPER"] = 36] = "SUPER";
    SyntaxType[SyntaxType["THIS"] = 37] = "THIS";
    SyntaxType[SyntaxType["TRUE"] = 38] = "TRUE";
    SyntaxType[SyntaxType["LET"] = 39] = "LET";
    SyntaxType[SyntaxType["WHILE"] = 40] = "WHILE";
    SyntaxType[SyntaxType["EOF"] = 41] = "EOF";
})(SyntaxType = exports.SyntaxType || (exports.SyntaxType = {}));
