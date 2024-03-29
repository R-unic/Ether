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
    SyntaxType[SyntaxType["PLUS_EQUAL"] = 22] = "PLUS_EQUAL";
    SyntaxType[SyntaxType["MINUS_EQUAL"] = 23] = "MINUS_EQUAL";
    SyntaxType[SyntaxType["STAR_EQUAL"] = 24] = "STAR_EQUAL";
    SyntaxType[SyntaxType["SLASH_EQUAL"] = 25] = "SLASH_EQUAL";
    SyntaxType[SyntaxType["CARAT_EQUAL"] = 26] = "CARAT_EQUAL";
    SyntaxType[SyntaxType["PERCENT_EQUAL"] = 27] = "PERCENT_EQUAL";
    SyntaxType[SyntaxType["AND_EQUAL"] = 28] = "AND_EQUAL";
    SyntaxType[SyntaxType["OR_EQUAL"] = 29] = "OR_EQUAL";
    SyntaxType[SyntaxType["PLUS_PLUS"] = 30] = "PLUS_PLUS";
    SyntaxType[SyntaxType["MINUS_MINUS"] = 31] = "MINUS_MINUS";
    SyntaxType[SyntaxType["COLON"] = 32] = "COLON";
    SyntaxType[SyntaxType["COLON_COLON"] = 33] = "COLON_COLON";
    // Literals.
    SyntaxType[SyntaxType["IDENTIFIER"] = 34] = "IDENTIFIER";
    SyntaxType[SyntaxType["STRING"] = 35] = "STRING";
    SyntaxType[SyntaxType["NUMBER"] = 36] = "NUMBER";
    // Keywords.
    SyntaxType[SyntaxType["AND"] = 37] = "AND";
    SyntaxType[SyntaxType["BREAK"] = 38] = "BREAK";
    SyntaxType[SyntaxType["CONTINUE"] = 39] = "CONTINUE";
    SyntaxType[SyntaxType["CLASS"] = 40] = "CLASS";
    SyntaxType[SyntaxType["ELSE"] = 41] = "ELSE";
    SyntaxType[SyntaxType["FALSE"] = 42] = "FALSE";
    SyntaxType[SyntaxType["METHOD"] = 43] = "METHOD";
    SyntaxType[SyntaxType["FOR"] = 44] = "FOR";
    SyntaxType[SyntaxType["IF"] = 45] = "IF";
    SyntaxType[SyntaxType["NULL"] = 46] = "NULL";
    SyntaxType[SyntaxType["OR"] = 47] = "OR";
    SyntaxType[SyntaxType["PRINT"] = 48] = "PRINT";
    SyntaxType[SyntaxType["RETURN"] = 49] = "RETURN";
    SyntaxType[SyntaxType["SUPER"] = 50] = "SUPER";
    SyntaxType[SyntaxType["THIS"] = 51] = "THIS";
    SyntaxType[SyntaxType["TRUE"] = 52] = "TRUE";
    SyntaxType[SyntaxType["LET"] = 53] = "LET";
    SyntaxType[SyntaxType["CONST"] = 54] = "CONST";
    SyntaxType[SyntaxType["WHILE"] = 55] = "WHILE";
    SyntaxType[SyntaxType["RAISE"] = 56] = "RAISE";
    SyntaxType[SyntaxType["GLOBAL"] = 57] = "GLOBAL";
    SyntaxType[SyntaxType["PUBLIC"] = 58] = "PUBLIC";
    SyntaxType[SyntaxType["PRIVATE"] = 59] = "PRIVATE";
    SyntaxType[SyntaxType["STATIC"] = 60] = "STATIC";
    SyntaxType[SyntaxType["EOF"] = 61] = "EOF";
})(SyntaxType = exports.SyntaxType || (exports.SyntaxType = {}));
