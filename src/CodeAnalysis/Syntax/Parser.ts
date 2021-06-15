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
            statements.push(this.Declaration() as Stmt.Statement);

        return statements;
    }

    private Expression(): Expr.Expression {
        return this.Assignment();
    }

    private Declaration(): Stmt.Statement | undefined {
        try {
            if (this.Match(Syntax.METHOD))
                return this.Method("method");

            if (this.Match(Syntax.LET))
                return this.VarDeclaration();

            return this.Statement();
        } catch (err) {
            this.Synchronize();
            return undefined;
        }
    }

    private VarDeclaration(): Stmt.Statement {
        const name: Token = this.Consume(Syntax.IDENTIFIER, "Expected variable name.");

        let initializer: Expr.Expression | undefined = this.Match(Syntax.EQUAL)?
            this.Expression()
            :undefined;

        this.Consume(Syntax.SEMICOLON, "Expected ';' after variable declaration.");
        return new Stmt.Variable(name, initializer);
    }

    private Statement(): Stmt.Statement {
        if (this.Match(Syntax.RETURN))
            return this.ReturnStatement()

        if (this.Match(Syntax.FOR))
            return this.ForStatement();

        if (this.Match(Syntax.IF))
            return this.IfStatement();

        if (this.Match(Syntax.RAISE))
            return this.RaiseStatement()

         if (this.Match(Syntax.PRINT))
            return this.PrintStatement();

        if (this.Match(Syntax.WHILE))
            return this.WhileStatement();

        if (this.Match(Syntax.LEFT_BRACE))
            return new Stmt.Block(this.Block());

        return this.ExpressionStatement();
    }

    private ReturnStatement(): Stmt.Return {
        const keyword: Token = this.Previous();
        let value: Expr.Expression | undefined = undefined;
        if (!this.Check(Syntax.SEMICOLON))
            value = this.Expression();

        this.Consume(Syntax.SEMICOLON, "Expected ';' after return value.");
        return new Stmt.Return(keyword, value as Expr.Expression);
    }

    private RaiseStatement(): Stmt.Raise {
        const value: Expr.Expression = this.Expression();
        this.Consume(Syntax.SEMICOLON, "Expected ';' after raised value.");
        return new Stmt.Raise(this.Peek(-3), value);
    }

    private Method(kind: string): Stmt.Method {
        const name: Token = this.Consume(Syntax.IDENTIFIER, `Expected ${kind} name.`);
        this.Consume(Syntax.LEFT_PAREN, `Expected '(' after ${kind} name.`);

        const parameters: Token[] = [];
        if (!this.Check(Syntax.RIGHT_PAREN))
            do {
                if (parameters.length >= 255)
                    this.Error(this.Peek(), "Methods can't have more than 255 parameters.");

                parameters.push(
                    this.Consume(Syntax.IDENTIFIER, "Expected parameter name.")
                );
            } while (this.Match(Syntax.COMMA));

        this.Consume(Syntax.RIGHT_PAREN, "Expected ')' after method parameters.");
        this.Consume(Syntax.LEFT_BRACE, `Expected '{' before ${kind} body.`);

        const body: Stmt.Statement[] = this.Block();
        return new Stmt.Method(name, parameters, body);
    }

    private ForStatement(): Stmt.Statement {
        this.Consume(Syntax.LEFT_PAREN, "Expected '(' after 'for'.");

        let initializer: Stmt.Statement | undefined;
        if (this.Match(Syntax.SEMICOLON))
            initializer = undefined;
        else if (this.Match(Syntax.LET))
            initializer = this.VarDeclaration();
        else
            initializer = this.ExpressionStatement();

        let condition: Expr.Expression | undefined = undefined;
        if (!this.Check(Syntax.SEMICOLON))
            condition = this.Expression();

        this.Consume(Syntax.SEMICOLON, "Expected ';' after loop condition.");
        let increment: Expr.Expression | undefined = undefined;
        if (!this.Check(Syntax.RIGHT_PAREN))
            increment = this.Expression();

        this.Consume(Syntax.RIGHT_PAREN, "Expected ')' after clauses.");
        let body: Stmt.Statement = this.Statement();

        if (increment !== undefined)
            body = new Stmt.Block([ body, new Stmt.Expression(increment) ]);

        if (condition === undefined)
            condition = new Expr.Literal(true);

        body = new Stmt.While(condition, body);
        if (initializer !== undefined)
            body = new Stmt.Block([ initializer, body ]);
            
        return body;
    }

    private WhileStatement(): Stmt.While {
        this.Consume(Syntax.LEFT_PAREN, "Expected '(' after 'while'.");
        const condition: Expr.Expression = this.Expression();
        this.Consume(Syntax.RIGHT_PAREN, "Expected ')' after condition.");
        const body: Stmt.Statement = this.Statement();

        return new Stmt.While(condition, body);
    }

    private IfStatement(): Stmt.If {
        this.Consume(Syntax.LEFT_PAREN, "Expected '(' after 'if'.");
        const condition: Expr.Expression = this.Expression();
        this.Consume(Syntax.RIGHT_PAREN, "Expected ')' after if condition.");

        const thenBranch: Stmt.Statement = this.Statement();
        let elseBranch: Stmt.Statement | undefined = undefined;
        if (this.Match(Syntax.ELSE))
            elseBranch = this.Statement();

        return new Stmt.If(condition, thenBranch, elseBranch)
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

    private Block(): Stmt.Statement[] {
        const statements: Stmt.Statement[] = [];

        while (!this.Check(Syntax.RIGHT_BRACE) && !this.Completed)
            statements.push(this.Declaration() as Stmt.Statement);

        this.Consume(Syntax.RIGHT_BRACE, "Expected '}' after block.");
        return statements;
    }

    private Assignment(): Expr.Expression {
        const expr: Expr.Expression = this.Or();

        if (this.Match(Syntax.EQUAL)) {
            const equals: Token = this.Previous();
            const value: Expr.Expression = this.Assignment();

            if (expr instanceof Expr.Variable) {
                const varExpr = expr as Expr.Variable;
                const name: Token = varExpr.Name;
                return new Expr.Assign(name, value);
            }

            this.Error(equals, "Invalid assignment target.");
        }

        return expr;
    }
 
    private Or(): Expr.Expression {
        let expr: Expr.Expression = this.And();

        while (this.Match(Syntax.OR)) {
            const operator: Token = this.Previous();
            const right: Expr.Expression = this.And();
            expr = new Expr.Logical(expr, operator, right);
        }

        return expr;
    }

    private And(): Expr.Expression {
        let expr: Expr.Expression = this.Equality();

        while (this.Match(Syntax.AND)) {
            const operator: Token = this.Previous();
            const right: Expr.Expression = this.Equality();
            expr = new Expr.Logical(expr, operator, right);
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

        return this.Call();
    }

    private Call(): Expr.Expression {
        let expr: Expr.Expression = this.Primary();

        while (true)
            if (this.Match(Syntax.LEFT_PAREN))
                expr = this.FinishCall(expr);
            else
                break;

        return expr;
    }

    private FinishCall(callee: Expr.Expression): Expr.Call {
        const args: Expr.Expression[] = [];
        if (!this.Check(Syntax.RIGHT_PAREN))
            do {
                if (args.length >= 255)
                    this.Error(this.Peek(), "Method call can't have more than 255 arguments.");
                args.push(this.Expression());
            } while (this.Match(Syntax.COMMA));

        const paren: Token = this.Consume(Syntax.RIGHT_PAREN, "Expected ')' after argument list.");
        return new Expr.Call(callee, paren, args);
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

        if (this.Match(Syntax.IDENTIFIER))
            return new Expr.Variable(this.Previous());

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

    public get Completed() {
        return this.Peek().Type === Syntax.EOF;
    }

    public Peek(offset: number = 0): Token {
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