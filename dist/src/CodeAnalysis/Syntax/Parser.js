"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const Ether_1 = require("../../Ether");
const SyntaxType_1 = require("../Syntax/SyntaxType");
const Expression_1 = require("./Expression");
const Statement_1 = require("./Statement");
class ParserError {
}
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }
    Parse() {
        const statements = [];
        while (!this.Completed)
            statements.push(this.Declaration());
        return statements;
    }
    Expression() {
        return this.Assignment();
    }
    Declaration() {
        try {
            if (this.Match(SyntaxType_1.SyntaxType.METHOD))
                return this.Method("method");
            if (this.Match(SyntaxType_1.SyntaxType.LET))
                return this.VarDeclaration();
            return this.Statement();
        }
        catch (err) {
            this.Synchronize();
            return undefined;
        }
    }
    VarDeclaration() {
        const name = this.Consume(SyntaxType_1.SyntaxType.IDENTIFIER, "Expected variable name.");
        let initializer = this.Match(SyntaxType_1.SyntaxType.EQUAL) ?
            this.Expression()
            : undefined;
        this.Consume(SyntaxType_1.SyntaxType.SEMICOLON, "Expected ';' after variable declaration.");
        return new Statement_1.Stmt.Variable(name, initializer);
    }
    Statement() {
        if (this.Match(SyntaxType_1.SyntaxType.RETURN))
            return this.ReturnStatement();
        if (this.Match(SyntaxType_1.SyntaxType.FOR))
            return this.ForStatement();
        if (this.Match(SyntaxType_1.SyntaxType.IF))
            return this.IfStatement();
        if (this.Match(SyntaxType_1.SyntaxType.RAISE))
            return this.RaiseStatement();
        if (this.Match(SyntaxType_1.SyntaxType.PRINT))
            return this.PrintStatement();
        if (this.Match(SyntaxType_1.SyntaxType.WHILE))
            return this.WhileStatement();
        if (this.Match(SyntaxType_1.SyntaxType.LEFT_BRACE))
            return new Statement_1.Stmt.Block(this.Block());
        return this.ExpressionStatement();
    }
    ReturnStatement() {
        const keyword = this.Previous();
        let value = undefined;
        if (!this.Check(SyntaxType_1.SyntaxType.SEMICOLON))
            value = this.Expression();
        this.Consume(SyntaxType_1.SyntaxType.SEMICOLON, "Expected ';' after return value.");
        return new Statement_1.Stmt.Return(keyword, value);
    }
    RaiseStatement() {
        const value = this.Expression();
        this.Consume(SyntaxType_1.SyntaxType.SEMICOLON, "Expected ';' after raised value.");
        return new Statement_1.Stmt.Raise(this.Peek(-3), value);
    }
    Method(kind) {
        const name = this.Consume(SyntaxType_1.SyntaxType.IDENTIFIER, `Expected ${kind} name.`);
        this.Consume(SyntaxType_1.SyntaxType.LEFT_PAREN, `Expected '(' after ${kind} name.`);
        const parameters = [];
        if (!this.Check(SyntaxType_1.SyntaxType.RIGHT_PAREN))
            do {
                if (parameters.length >= 255)
                    this.Error(this.Peek(), "Methods can't have more than 255 parameters.");
                parameters.push(this.Consume(SyntaxType_1.SyntaxType.IDENTIFIER, "Expected parameter name."));
            } while (this.Match(SyntaxType_1.SyntaxType.COMMA));
        this.Consume(SyntaxType_1.SyntaxType.RIGHT_PAREN, "Expected ')' after method parameters.");
        this.Consume(SyntaxType_1.SyntaxType.LEFT_BRACE, `Expected '{' before ${kind} body.`);
        const body = this.Block();
        return new Statement_1.Stmt.Method(name, parameters, body);
    }
    ForStatement() {
        this.Consume(SyntaxType_1.SyntaxType.LEFT_PAREN, "Expected '(' after 'for'.");
        let initializer;
        if (this.Match(SyntaxType_1.SyntaxType.SEMICOLON))
            initializer = undefined;
        else if (this.Match(SyntaxType_1.SyntaxType.LET))
            initializer = this.VarDeclaration();
        else
            initializer = this.ExpressionStatement();
        let condition = undefined;
        if (!this.Check(SyntaxType_1.SyntaxType.SEMICOLON))
            condition = this.Expression();
        this.Consume(SyntaxType_1.SyntaxType.SEMICOLON, "Expected ';' after loop condition.");
        let increment = undefined;
        if (!this.Check(SyntaxType_1.SyntaxType.RIGHT_PAREN))
            increment = this.Expression();
        this.Consume(SyntaxType_1.SyntaxType.RIGHT_PAREN, "Expected ')' after clauses.");
        let body = this.Statement();
        if (increment !== undefined)
            body = new Statement_1.Stmt.Block([body, new Statement_1.Stmt.Expression(increment)]);
        if (condition === undefined)
            condition = new Expression_1.Expr.Literal(true);
        body = new Statement_1.Stmt.While(condition, body);
        if (initializer !== undefined)
            body = new Statement_1.Stmt.Block([initializer, body]);
        return body;
    }
    WhileStatement() {
        this.Consume(SyntaxType_1.SyntaxType.LEFT_PAREN, "Expected '(' after 'while'.");
        const condition = this.Expression();
        this.Consume(SyntaxType_1.SyntaxType.RIGHT_PAREN, "Expected ')' after condition.");
        const body = this.Statement();
        return new Statement_1.Stmt.While(condition, body);
    }
    IfStatement() {
        this.Consume(SyntaxType_1.SyntaxType.LEFT_PAREN, "Expected '(' after 'if'.");
        const condition = this.Expression();
        this.Consume(SyntaxType_1.SyntaxType.RIGHT_PAREN, "Expected ')' after if condition.");
        const thenBranch = this.Statement();
        let elseBranch = undefined;
        if (this.Match(SyntaxType_1.SyntaxType.ELSE))
            elseBranch = this.Statement();
        return new Statement_1.Stmt.If(condition, thenBranch, elseBranch);
    }
    PrintStatement() {
        const value = this.Expression();
        this.Consume(SyntaxType_1.SyntaxType.SEMICOLON, "Expected ';' after value.");
        return new Statement_1.Stmt.Print(value);
    }
    ExpressionStatement() {
        const expr = this.Expression();
        this.Consume(SyntaxType_1.SyntaxType.SEMICOLON, "Expected ';' after expression.");
        return new Statement_1.Stmt.Expression(expr);
    }
    Block() {
        const statements = [];
        while (!this.Check(SyntaxType_1.SyntaxType.RIGHT_BRACE) && !this.Completed)
            statements.push(this.Declaration());
        this.Consume(SyntaxType_1.SyntaxType.RIGHT_BRACE, "Expected '}' after block.");
        return statements;
    }
    Assignment() {
        const expr = this.Or();
        if (this.Match(SyntaxType_1.SyntaxType.EQUAL)) {
            const equals = this.Previous();
            const value = this.Assignment();
            if (expr instanceof Expression_1.Expr.Variable) {
                const varExpr = expr;
                const name = varExpr.Name;
                return new Expression_1.Expr.Assign(name, value);
            }
            this.Error(equals, "Invalid assignment target.");
        }
        return expr;
    }
    Or() {
        let expr = this.And();
        while (this.Match(SyntaxType_1.SyntaxType.OR)) {
            const operator = this.Previous();
            const right = this.And();
            expr = new Expression_1.Expr.Logical(expr, operator, right);
        }
        return expr;
    }
    And() {
        let expr = this.Equality();
        while (this.Match(SyntaxType_1.SyntaxType.AND)) {
            const operator = this.Previous();
            const right = this.Equality();
            expr = new Expression_1.Expr.Logical(expr, operator, right);
        }
        return expr;
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
        return this.Call();
    }
    Call() {
        let expr = this.Primary();
        while (true)
            if (this.Match(SyntaxType_1.SyntaxType.LEFT_PAREN))
                expr = this.FinishCall(expr);
            else
                break;
        return expr;
    }
    FinishCall(callee) {
        const args = [];
        if (!this.Check(SyntaxType_1.SyntaxType.RIGHT_PAREN))
            do {
                if (args.length >= 255)
                    this.Error(this.Peek(), "Method call can't have more than 255 arguments.");
                args.push(this.Expression());
            } while (this.Match(SyntaxType_1.SyntaxType.COMMA));
        const paren = this.Consume(SyntaxType_1.SyntaxType.RIGHT_PAREN, "Expected ')' after argument list.");
        return new Expression_1.Expr.Call(callee, paren, args);
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
        if (this.Match(SyntaxType_1.SyntaxType.IDENTIFIER))
            return new Expression_1.Expr.Variable(this.Previous());
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
