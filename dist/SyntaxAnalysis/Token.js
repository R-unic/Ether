"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const SyntaxType_1 = require("./Enumerations/SyntaxType");
class Token {
    constructor(Type, Lexeme, Literal, Line) {
        this.Type = Type;
        this.Lexeme = Lexeme;
        this.Literal = Literal;
        this.Line = Line;
    }
    ToString() {
        return `Token(${SyntaxType_1.SyntaxType[this.Type]}, Lexeme: "${this.Lexeme}", Value: ${this.Literal})`;
    }
}
exports.Token = Token;
