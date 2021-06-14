"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const Ether_1 = require("../Ether");
const SyntaxType_1 = require("./Enumerations/SyntaxType");
const Expression_1 = require("./Expression");
class ParserError extends SyntaxError {
}
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }
    Parse() {
        try {
            return this.Expression();
        }
        catch (err) {
            return undefined;
        }
    }
    Expression() {
        return this.Equality();
    }
    Equality() {
        let expr = this.Comparison();
        while (this.Match(SyntaxType_1.SyntaxType.BANG_EQUAL, SyntaxType_1.SyntaxType.EQUAL_EQUAL)) {
            const operator = this.Previous();
            const right = this.Comparison();
            expr = new Expression_1.Expr.Binary(expr, operator, right);
        }
        return expr;
    }
    Comparison() {
        let expr = this.Term();
        while (this.Match(SyntaxType_1.SyntaxType.GREATER, SyntaxType_1.SyntaxType.GREATER_EQUAL, SyntaxType_1.SyntaxType.LESS, SyntaxType_1.SyntaxType.LESS_EQUAL)) {
            const operator = this.Previous();
            const right = this.Term();
            expr = new Expression_1.Expr.Binary(expr, operator, right);
        }
        return expr;
    }
    Term() {
        let expr = this.Factor();
        while (this.Match(SyntaxType_1.SyntaxType.MINUS, SyntaxType_1.SyntaxType.PLUS)) {
            const operator = this.Previous();
            const right = this.Factor();
            expr = new Expression_1.Expr.Binary(expr, operator, right);
        }
        return expr;
    }
    Factor() {
        let expr = this.Unary();
        while (this.Match(SyntaxType_1.SyntaxType.SLASH, SyntaxType_1.SyntaxType.STAR, SyntaxType_1.SyntaxType.CARAT, SyntaxType_1.SyntaxType.PERCENT)) {
            const operator = this.Previous();
            const right = this.Unary();
            expr = new Expression_1.Expr.Binary(expr, operator, right);
        }
        return expr;
    }
    Unary() {
        while (this.Match(SyntaxType_1.SyntaxType.BANG, SyntaxType_1.SyntaxType.MINUS)) {
            const operator = this.Previous();
            const right = this.Unary();
            return new Expression_1.Expr.Unary(operator, right);
        }
        return this.Primary();
    }
    Primary() {
        if (this.Match(SyntaxType_1.SyntaxType.FALSE))
            return new Expression_1.Expr.Literal(false);
        if (this.Match(SyntaxType_1.SyntaxType.TRUE))
            return new Expression_1.Expr.Literal(true);
        if (this.Match(SyntaxType_1.SyntaxType.NULL))
            return new Expression_1.Expr.Literal(undefined);
        if (this.Match(SyntaxType_1.SyntaxType.NUMBER, SyntaxType_1.SyntaxType.STRING))
            return new Expression_1.Expr.Literal(this.Previous().Literal);
        if (this.Match(SyntaxType_1.SyntaxType.LEFT_PAREN)) {
            const expr = this.Expression();
            this.Consume(SyntaxType_1.SyntaxType.RIGHT_PAREN, "Expected ')' after expression.");
            return new Expression_1.Expr.Grouping(expr);
        }
        throw this.Error(this.Peek(), "Expected expression.");
    }
    Match(...types) {
        for (const type of types) {
            if (this.Check(type)) {
                this.Advance();
                return true;
            }
        }
        return false;
    }
    Check(type) {
        if (this.Completed)
            return false;
        return this.Peek().Type === type;
    }
    Advance() {
        if (!this.Completed)
            this.current++;
        return this.Previous();
    }
    get Completed() {
        return this.Peek().Type === SyntaxType_1.SyntaxType.EOF;
    }
    Peek(offset = 0) {
        return this.tokens[this.current + offset];
    }
    Previous() {
        return this.Peek(-1);
    }
    Consume(type, message) {
        if (this.Check(type))
            return this.Advance();
        throw this.Error(this.Peek(), message);
    }
    Error(token, message) {
        Ether_1.Ether.Error(token, message);
        return new ParserError;
    }
    Synchronize() {
        this.Advance();
        while (!this.Completed) {
            if (this.Previous().Type === SyntaxType_1.SyntaxType.SEMICOLON)
                return;
            switch (this.Peek().Type) {
                case SyntaxType_1.SyntaxType.CLASS:
                case SyntaxType_1.SyntaxType.METHOD:
                case SyntaxType_1.SyntaxType.LET:
                case SyntaxType_1.SyntaxType.FOR:
                case SyntaxType_1.SyntaxType.IF:
                case SyntaxType_1.SyntaxType.WHILE:
                case SyntaxType_1.SyntaxType.PRINT:
                case SyntaxType_1.SyntaxType.RETURN:
                    return;
            }
            this.Advance();
        }
    }
}
exports.Parser = Parser;
