import { Ether } from "../../Ether";
import { SyntaxType as Syntax } from "../Syntax/SyntaxType";
import { Expr } from "./Expression";
import { Stmt } from "./Statement";
import { Token } from "./Token";

class ParserError {}

export class Parser {
    private current = 0;

    public constructor(
        private readonly tokens: Token[]
    ) {}

    public Parse(): Stmt.Statement[] {
        const statements: Stmt.Statement[] = [];
        while (!this.Completed)
            statements.push(this.Statement());

        return statements;
    }

    public Expression(): Expr.Expression {
        return this.AndOr();
    }

    public Statement(): Stmt.Statement {
        if (this.Match(Syntax.PRINT))
            return this.PrintStatement();

        return this.ExpressionStatement();
    }

    private PrintStatement(): Stmt.Print {
        const value: Expr.Expression = this.Expression();
        this.Consume(Syntax.SEMICOLON, "Expected ';' after value.");
        return new Stmt.Print(value);
    }

    private ExpressionStatement(): Stmt.Expression {
        const expr: Expr.Expression = this.Expression();
        this.Consume(Syntax.SEMICOLON, "Expected ';' after expression.");
        return new Stmt.Expression(expr);
    }

    private AndOr(): Expr.Expression {
        let expr: Expr.Expression = this.Equality();

        while (this.Match(Syntax.AND, Syntax.OR)) {
            const operator: Token = this.Previous();
            const right: Expr.Expression = this.Equality();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }
 
    private Equality(): Expr.Expression {
        let expr: Expr.Expression = this.Comparison();

        while (this.Match(Syntax.BANG_EQUAL, Syntax.EQUAL_EQUAL)) {
            const operator: Token = this.Previous();
            const right: Expr.Expression = this.Comparison();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Comparison(): Expr.Expression {
        let expr: Expr.Expression = this.Term();

        while (this.Match(Syntax.GREATER, Syntax.GREATER_EQUAL, Syntax.LESS, Syntax.LESS_EQUAL)) {
            const operator: Token = this.Previous();
            const right: Expr.Expression = this.Term();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Term(): Expr.Expression {
        let expr: Expr.Expression = this.Factor();

        while(this.Match(Syntax.MINUS, Syntax.PLUS)) {
            const operator: Token = this.Previous();
            const right: Expr.Expression = this.Factor();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Factor(): Expr.Expression {
        let expr: Expr.Expression = this.Unary();

        while(this.Match(Syntax.SLASH, Syntax.STAR, Syntax.CARAT, Syntax.PERCENT)) {
            const operator: Token = this.Previous();
            const right: Expr.Expression = this.Unary();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Unary(): Expr.Expression {
        while(this.Match(Syntax.BANG, Syntax.MINUS)) {
            const operator: Token = this.Previous();
            const right: Expr.Expression = this.Unary();
            return new Expr.Unary(operator, right);
        }

        return this.Primary();
    }

    private Primary(): Expr.Expression {
        if (this.Match(Syntax.FALSE))
            return new Expr.Literal(false);

        if (this.Match(Syntax.TRUE))
            return new Expr.Literal(true);

        if (this.Match(Syntax.NULL))
            return new Expr.Literal(undefined);

        if (this.Match(Syntax.NUMBER, Syntax.STRING))
            return new Expr.Literal(this.Previous().Literal);

        if (this.Match(Syntax.LEFT_PAREN)) {
            const expr: Expr.Expression = this.Expression();
            this.Consume(Syntax.RIGHT_PAREN, "Expected ')' after expression.");
            return new Expr.Grouping(expr);
        }
        
        throw this.Error(this.Peek(), "Expected expression.");
    }

    private Match(...types: Syntax[]): boolean {
        for (const type of types) {
            if (this.Check(type)) {
                this.Advance();
                return true;
            }
        }
        return false;
    }

    private Check(type: Syntax): boolean {
        if (this.Completed)
            return false;
        return this.Peek().Type === type;
    }

    private Advance(): Token {
        if (!this.Completed)
            this.current++;
        return this.Previous();
    }

    private get Completed() {
        return this.Peek().Type === Syntax.EOF;
    }

    private Peek(offset: number = 0): Token {
        return this.tokens[this.current + offset];
    }

    private Previous(): Token {
        return this.Peek(-1);
    }

    private Consume(type: Syntax, message: string): Token {
        if (this.Check(type))
            return this.Advance();

        throw this.Error(this.Peek(), message);
    }

    private Error(token: Token, message: string): ParserError {
        Ether.Error(token, message);
        return new ParserError;
    }

    private Synchronize(): void {
        this.Advance();

        while (!this.Completed) {
            if (this.Previous().Type === Syntax.SEMICOLON)
                return;

            switch (this.Peek().Type) {
                case Syntax.CLASS:
                case Syntax.METHOD:
                case Syntax.LET:
                case Syntax.FOR:
                case Syntax.IF:
                case Syntax.WHILE:
                case Syntax.PRINT:
                case Syntax.RETURN:
                    return;
            }

            this.Advance();
        }
    }
}