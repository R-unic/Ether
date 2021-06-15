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
    SyntaxType[SyntaxType["PLUS_EQUALS"] = 22] = "PLUS_EQUALS";
    SyntaxType[SyntaxType["MINUS_EQUALS"] = 23] = "MINUS_EQUALS";
    SyntaxType[SyntaxType["STAR_EQUALS"] = 24] = "STAR_EQUALS";
    SyntaxType[SyntaxType["SLASH_EQUALS"] = 25] = "SLASH_EQUALS";
    SyntaxType[SyntaxType["CARAT_EQUALS"] = 26] = "CARAT_EQUALS";
    SyntaxType[SyntaxType["PERCENT_EQUALS"] = 27] = "PERCENT_EQUALS";
    SyntaxType[SyntaxType["AND_EQUALS"] = 28] = "AND_EQUALS";
    SyntaxType[SyntaxType["OR_EQUALS"] = 29] = "OR_EQUALS";
    SyntaxType[SyntaxType["PLUS_PLUS"] = 30] = "PLUS_PLUS";
    SyntaxType[SyntaxType["MINUS_MINUS"] = 31] = "MINUS_MINUS";
    // Literals.
    SyntaxType[SyntaxType["IDENTIFIER"] = 32] = "IDENTIFIER";
    SyntaxType[SyntaxType["STRING"] = 33] = "STRING";
    SyntaxType[SyntaxType["NUMBER"] = 34] = "NUMBER";
    // Keywords.
    SyntaxType[SyntaxType["AND"] = 35] = "AND";
    SyntaxType[SyntaxType["BREAK"] = 36] = "BREAK";
    SyntaxType[SyntaxType["CONTINUE"] = 37] = "CONTINUE";
    SyntaxType[SyntaxType["CLASS"] = 38] = "CLASS";
    SyntaxType[SyntaxType["ELSE"] = 39] = "ELSE";
    SyntaxType[SyntaxType["FALSE"] = 40] = "FALSE";
    SyntaxType[SyntaxType["METHOD"] = 41] = "METHOD";
    SyntaxType[SyntaxType["FOR"] = 42] = "FOR";
    SyntaxType[SyntaxType["IF"] = 43] = "IF";
    SyntaxType[SyntaxType["NULL"] = 44] = "NULL";
    SyntaxType[SyntaxType["OR"] = 45] = "OR";
    SyntaxType[SyntaxType["PRINT"] = 46] = "PRINT";
    SyntaxType[SyntaxType["RETURN"] = 47] = "RETURN";
    SyntaxType[SyntaxType["SUPER"] = 48] = "SUPER";
    SyntaxType[SyntaxType["THIS"] = 49] = "THIS";
    SyntaxType[SyntaxType["TRUE"] = 50] = "TRUE";
    SyntaxType[SyntaxType["LET"] = 51] = "LET";
    SyntaxType[SyntaxType["CONST"] = 52] = "CONST";
    SyntaxType[SyntaxType["WHILE"] = 53] = "WHILE";
    SyntaxType[SyntaxType["RAISE"] = 54] = "RAISE";
    SyntaxType[SyntaxType["EOF"] = 55] = "EOF";
})(SyntaxType = exports.SyntaxType || (exports.SyntaxType = {}));