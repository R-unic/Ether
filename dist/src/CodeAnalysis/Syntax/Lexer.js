"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const Ether_1 = require("../../Ether");
const SyntaxType_1 = require("./SyntaxType");
const Keywords_1 = require("./Keywords");
const Token_1 = require("./Token");
class Lexer {
    constructor(source) {
        this.source = source;
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
    }
    get Completed() {
        return this.current >= this.source.length;
    }
    LexTokens() {
        while (!this.Completed) {
            this.start = this.current;
            this.Lex();
        }
        this.tokens.push(new Token_1.Token(SyntaxType_1.SyntaxType.EOF, "", null, this.line));
        return this.tokens;
    }
    Lex() {
        const char = this.Advance();
        switch (char) {
            case "(":
                this.AddToken(SyntaxType_1.SyntaxType.LEFT_PAREN);
                break;
            case ")":
                this.AddToken(SyntaxType_1.SyntaxType.RIGHT_PAREN);
                break;
            case "{":
                this.AddToken(SyntaxType_1.SyntaxType.LEFT_BRACE);
                break;
            case "}":
                this.AddToken(SyntaxType_1.SyntaxType.RIGHT_BRACE);
                break;
            case ",":
                this.AddToken(SyntaxType_1.SyntaxType.COMMA);
                break;
            case ".":
                this.AddToken(SyntaxType_1.SyntaxType.DOT);
                break;
            case ";":
                this.AddToken(SyntaxType_1.SyntaxType.SEMICOLON);
                break;
            case "-": {
                let type = SyntaxType_1.SyntaxType.MINUS;
                if (this.Match('='))
                    type = SyntaxType_1.SyntaxType.MINUS_EQUALS;
                if (this.Match('-'))
                    type = SyntaxType_1.SyntaxType.MINUS_MINUS;
                this.AddToken(type);
                break;
            }
            case "+": {
                let type = SyntaxType_1.SyntaxType.PLUS;
                if (this.Match('='))
                    type = SyntaxType_1.SyntaxType.PLUS_EQUALS;
                if (this.Match('+'))
                    type = SyntaxType_1.SyntaxType.PLUS_PLUS;
                this.AddToken(type);
                break;
            }
            case "*":
                this.AddToken(this.Match('=') ? SyntaxType_1.SyntaxType.STAR_EQUALS : SyntaxType_1.SyntaxType.STAR);
                break;
            case '/':
                this.AddToken(this.Match('=') ? SyntaxType_1.SyntaxType.SLASH_EQUALS : SyntaxType_1.SyntaxType.SLASH);
                break;
            case "^":
                this.AddToken(this.Match('=') ? SyntaxType_1.SyntaxType.CARAT_EQUALS : SyntaxType_1.SyntaxType.CARAT);
                break;
            case "%":
                this.AddToken(this.Match('=') ? SyntaxType_1.SyntaxType.PERCENT_EQUALS : SyntaxType_1.SyntaxType.PERCENT);
                break;
            case "#":
                if (this.Match("#"))
                    this.SkipComment();
                else
                    this.AddToken(SyntaxType_1.SyntaxType.HASHTAG);
                break;
            case '!':
                this.AddToken(this.Match('=') ? SyntaxType_1.SyntaxType.BANG_EQUAL : SyntaxType_1.SyntaxType.BANG);
                break;
            case '=':
                this.AddToken(this.Match('=') ? SyntaxType_1.SyntaxType.EQUAL_EQUAL : SyntaxType_1.SyntaxType.EQUAL);
                break;
            case '<':
                this.AddToken(this.Match('=') ? SyntaxType_1.SyntaxType.LESS_EQUAL : SyntaxType_1.SyntaxType.LESS);
                break;
            case '>':
                this.AddToken(this.Match('=') ? SyntaxType_1.SyntaxType.GREATER_EQUAL : SyntaxType_1.SyntaxType.GREATER);
                break;
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            case "'":
            case '"':
                this.String();
                break;
            case "|":
                this.AddToken(this.Match('=') ? SyntaxType_1.SyntaxType.OR_EQUALS : SyntaxType_1.SyntaxType.OR);
                break;
            case "&":
                this.AddToken(this.Match('=') ? SyntaxType_1.SyntaxType.AND_EQUALS : SyntaxType_1.SyntaxType.AND);
                break;
            default:
                if (this.IsDigit(char))
                    this.Number();
                else if (this.IsAlpha(char))
                    this.Identifier();
                else
                    Ether_1.Ether.Error(this.line, "Unexpected character.");
                break;
        }
    }
    SkipComment() {
        while (this.Peek() !== "\n" && !this.Completed)
            this.Advance();
    }
    Advance() {
        return this.source.charAt(this.current++);
    }
    AddToken(type, literal = null) {
        const text = this.source.substring(this.start, this.current).trim();
        this.tokens.push(new Token_1.Token(type, text, literal, this.line));
    }
    Match(expected) {
        if (this.Completed)
            return false;
        if (this.source.charAt(this.current) !== expected)
            return false;
        this.current++;
        return true;
    }
    Peek(offset = 0) {
        if (this.Completed)
            return "\0";
        if (this.current + offset >= this.source.length)
            return "\0";
        return this.source.charAt(this.current + offset);
    }
    IsAlpha(c) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_';
    }
    IsDigit(c) {
        return !isNaN(Number(c));
    }
    IsAlphaNumeric(c) {
        return c === " " ? false : this.IsAlpha(c) || this.IsDigit(c);
    }
    Identifier() {
        var _a;
        while (this.IsAlphaNumeric(this.Peek()))
            this.Advance();
        const text = this.source.substring(this.start, this.current).trim();
        let type = (_a = Keywords_1.Keywords.get(text)) !== null && _a !== void 0 ? _a : SyntaxType_1.SyntaxType.IDENTIFIER;
        this.AddToken(type);
    }
    String() {
        while ((this.Peek() !== '"' && this.Peek() !== "'") && !this.Completed) {
            if (this.Peek() === "\n")
                this.line++;
            this.Advance();
        }
        if (this.Completed) {
            Ether_1.Ether.Error(this.line, "Unterminated string.");
            return;
        }
        this.Advance();
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.AddToken(SyntaxType_1.SyntaxType.STRING, value);
    }
    Number() {
        while (this.IsDigit(this.Peek()))
            this.Advance();
        if (this.Peek() === "." && this.IsDigit(this.Peek(1))) {
            this.Advance();
            while (this.IsDigit(this.Peek()))
                this.Advance();
        }
        this.AddToken(SyntaxType_1.SyntaxType.NUMBER, Number(this.source.substring(this.start, this.current)));
    }
}
exports.Lexer = Lexer;
