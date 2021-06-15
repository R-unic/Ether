import { Ether } from "../../Ether";
import { SyntaxType } from "../Syntax/SyntaxType";
import { Expr } from "./Expression";
import { Token } from "./Token";

class ParserError extends SyntaxError {}

export class Parser {
    private current = 0;

    public constructor(
        private readonly tokens: Token[]
    ) {}

    public Parse(): Expr.Base | undefined {
        try {
            return this.Expression();
        } catch (err) {
            return undefined;
        }
    }

    public Expression(): Expr.Base {
        return this.Equality();
    }

    private Equality(): Expr.Base {
        let expr: Expr.Base = this.Comparison();

        while (this.Match(SyntaxType.BANG_EQUAL, SyntaxType.EQUAL_EQUAL)) {
            const operator: Token = this.Previous();
            const right: Expr.Base = this.Comparison();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Comparison(): Expr.Base {
        let expr: Expr.Base = this.Term();

        while (this.Match(SyntaxType.GREATER, SyntaxType.GREATER_EQUAL, SyntaxType.LESS, SyntaxType.LESS_EQUAL)) {
            const operator: Token = this.Previous();
            const right: Expr.Base = this.Term();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Term(): Expr.Base {
        let expr: Expr.Base = this.Factor();

        while(this.Match(SyntaxType.MINUS, SyntaxType.PLUS)) {
            const operator: Token = this.Previous();
            const right: Expr.Base = this.Factor();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Factor(): Expr.Base {
        let expr: Expr.Base = this.Unary();

        while(this.Match(SyntaxType.SLASH, SyntaxType.STAR, SyntaxType.CARAT, SyntaxType.PERCENT)) {
            const operator: Token = this.Previous();
            const right: Expr.Base = this.Unary();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private Unary(): Expr.Base {
        while(this.Match(SyntaxType.BANG, SyntaxType.MINUS)) {
            const operator: Token = this.Previous();
            const right: Expr.Base = this.Unary();
            return new Expr.Unary(operator, right);
        }

        return this.Primary();
    }

    private Primary(): Expr.Base {
        if (this.Match(SyntaxType.FALSE))
            return new Expr.Literal(false);

        if (this.Match(SyntaxType.TRUE))
            return new Expr.Literal(true);

        if (this.Match(SyntaxType.NULL))
            return new Expr.Literal(undefined);

        if (this.Match(SyntaxType.NUMBER, SyntaxType.STRING))
            return new Expr.Literal(this.Previous().Literal);

        if (this.Match(SyntaxType.LEFT_PAREN)) {
            const expr: Expr.Base = this.Expression();
            this.Consume(SyntaxType.RIGHT_PAREN, "Expected ')' after expression.");
            return new Expr.Grouping(expr);
        }

        throw this.Error(this.Peek(), "Expected expression.");
    }

    private Match(...types: SyntaxType[]): boolean {
        for (const type of types) {
            if (this.Check(type)) {
                this.Advance();
                return true;
            }
        }
        return false;
    }

    private Check(type: SyntaxType): boolean {
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
        return this.Peek().Type === SyntaxType.EOF;
    }

    private Peek(offset: number = 0): Token {
        return this.tokens[this.current + offset];
    }

    private Previous(): Token {
        return this.Peek(-1);
    }

    private Consume(type: SyntaxType, message: string): Token {
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
            if (this.Previous().Type === SyntaxType.SEMICOLON)
                return;

            switch (this.Peek().Type) {
                case SyntaxType.CLASS:
                case SyntaxType.METHOD:
                case SyntaxType.LET:
                case SyntaxType.FOR:
                case SyntaxType.IF:
                case SyntaxType.WHILE:
                case SyntaxType.PRINT:
                case SyntaxType.RETURN:
                    return;
            }

            this.Advance();
        }
    }
}