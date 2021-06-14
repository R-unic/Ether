"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const TokenType_1 = require("./Enumerations/TokenType");
class Token {
    constructor(Type, Lexeme, Literal, Line) {
        this.Type = Type;
        this.Lexeme = Lexeme;
        this.Literal = Literal;
        this.Line = Line;
    }
    ToString() {
        return `Token(${TokenType_1.SyntaxType[this.Type]}, Lexeme: "${this.Lexeme}", Value: ${this.Literal})`;
    }
}
exports.Token = Token;
