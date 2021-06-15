import { cyan, green, magenta, red, yellow } from "colors/safe";
import { log } from "console";
import { Ether } from "../../Ether";
import { Expr } from "../Syntax/Expression";
import { Parser } from "../Syntax/Parser";
import { Stmt } from "../Syntax/Statement";
import { SyntaxType as Syntax } from "../Syntax/SyntaxType";
import { Token } from "../Syntax/Token";
import { Callable } from "./Callable";
import { Environment } from "./Environment";
import { TimeMethod } from "./Lib/Time";
import { WaitMethod } from "./Lib/Wait";
import { WarnMethod } from "./Lib/Warn";
import { Method } from "./Method";

export class RuntimeError extends EvalError {
    public constructor(
        public readonly Token?: Token, 
        message?: string
    ) {
        super(message);
    }
}

export class Return extends RuntimeError {
    public constructor(
        public readonly Value: unknown,
        token: Token
    ) {
        super(token, "A 'return' statement can only be used within a function body.");
    }
}

export class Interpreter implements Expr.Visitor<unknown>, Stmt.Visitor<void> {
    public readonly Globals = new Environment;
    public Parser?: Parser;
    private environment = this.Globals;

    public constructor() {
        this.Globals.Define("time", new TimeMethod);
        this.Globals.Define("warn", new WarnMethod);
        this.Globals.Define("wait", new WaitMethod);
        this.Globals.Define("__etherversion", `Ether 1.4.0`);
    }

    public Interpret(parser: Parser, statements: Stmt.Statement[], repl: boolean): void {
        try {
            this.Parser = parser;
            for(const statement of statements)
                if (statement instanceof Stmt.Expression && repl === true) {
                    const value: unknown = this.Evaluate(statement.Expression);
                    log(this.GetStyling(value));
                } else
                    this.Execute(statement);
        } catch (err) {
            Ether.RuntimeError(err as RuntimeError);
        }
    }

    private Evaluate(expr: Expr.Expression): unknown {
        return expr.Accept<unknown>(this);
    }

    private Execute(stmt: Stmt.Statement): void {
        stmt.Accept<void>(this);
    }

    public ExecuteBlock(statements: Stmt.Statement[], environment: Environment): void {
        const previous: Environment = this.environment;

        try {
            this.environment = environment;

            for (const statement of statements)
                this.Execute(statement);
        } finally {
            this.environment = previous;
        }
    }

    public VisitReturnStmt(stmt: Stmt.Return): void {
        let value: unknown = undefined;
        if (stmt.Value !== undefined)
            value = this.Evaluate(stmt.Value);

        throw new Return(value, stmt.Keyword);
    }

    public VisitRaiseStmt(stmt: Stmt.Raise): void {
        const value: unknown = this.Evaluate(stmt.Expression);
        Ether.RaiseError(stmt.Token, this.Stringify(value));
    }

    public VisitMethodStmt(stmt: Stmt.Method): void {
        const method = new Method(stmt, this.environment);
        this.environment.Define(stmt.Name.Lexeme, method);
    }

    public VisitWhileStmt(stmt: Stmt.While): void {
        while (this.IsTruthy(this.Evaluate(stmt.Condition)))
            this.Execute(stmt.Body);
    }

    public VisitIfStmt(stmt: Stmt.If): void {
        if (this.IsTruthy(this.Evaluate(stmt.Condition)))
            this.Execute(stmt.ThenBranch);
        else if (stmt.ElseBranch !== undefined)
            this.Execute(stmt.ElseBranch);
    }

    public VisitBlockStmt(stmt: Stmt.Block): void {
        this.ExecuteBlock(stmt.Statements, new Environment(this.environment));
    }

    public VisitExpressionStmt(stmt: Stmt.Expression): void {
        this.Evaluate(stmt.Expression);
    }

    public VisitPrintStmt(stmt: Stmt.Print): void {
        const value: unknown = this.Evaluate(stmt.Expression);
        log(this.GetStyling(value) !== undefined ? this.GetStyling(value) : this.Stringify(value));
    }

    public VisitVariableStmt(stmt: Stmt.Variable): void {
        let value: unknown;
        if (stmt.Initializer !== undefined)
            value = this.Evaluate(stmt.Initializer);

        this.environment.Define(stmt.Name.Lexeme, value);
    }

    public VisitCallExpr(expr: Expr.Call): unknown {
        const callee: unknown = this.Evaluate(expr.Callee);

        const args: unknown[] = [];
        for (const arg of expr.Arguments)
            args.push(this.Evaluate(arg));

        const method = callee as Callable;
        if (!method)
            throw new RuntimeError(expr.Paren, "Can only call methods and classes.");

        if (args.length != method.Arity())
            throw new RuntimeError(expr.Paren, `Expected ${method.Arity()} arguments, got ${args.length}.`);

        return method.Call(this, args);
    }

    public VisitLogicalExpr(expr: Expr.Logical): unknown {
        const left: unknown = this.Evaluate(expr.Left);

        if (expr.Operator.Type === Syntax.OR) {
            if (this.IsTruthy(left))
                return left;
        } else {
            if (!this.IsTruthy(left))
                return left;
        }
        
        return this.Evaluate(expr.Right);
    }

    public VisitAssignExpr(expr: Expr.Assign): unknown {
        const value: unknown = this.Evaluate(expr.Value);
        this.environment.Assign(expr.Name, value);
        return value;
    }

    public VisitVariableExpr(expr: Expr.Variable): unknown {
        return this.environment.Get(expr.Name);
    }

    public VisitBinaryExpr(expr: Expr.Binary): unknown {
        const left: unknown = this.Evaluate(expr.Left);
        const right: unknown = this.Evaluate(expr.Right);

        switch (expr.Operator.Type) {
            case Syntax.BANG_EQUAL: return !this.IsEqual(left, right);
            case Syntax.EQUAL_EQUAL: return this.IsEqual(left, right);
            case Syntax.GREATER:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) > (right as number);
            case Syntax.GREATER_EQUAL:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) >= (right as number);
            case Syntax.LESS:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) < (right as number);
            case Syntax.LESS_EQUAL:
                return (left as number) <= (right as number);

            case Syntax.PLUS: {
                if (typeof left === "number" && typeof right === "number")
                    return (left as number) + (right as number);

                if (typeof left === "string" && typeof right === "string")
                    return (left as string) + (right as string);

                throw new RuntimeError(expr.Operator, "Operands must be two numbers or two strings.");
            }
                
            case Syntax.MINUS:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) - (right as number);
            case Syntax.SLASH:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) / (right as number);
            case Syntax.STAR:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) * (right as number);
            case Syntax.CARAT:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) ** (right as number);
            case Syntax.PERCENT:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) % (right as number);
        }

        return void 0;
    }
    
    public VisitGroupingExpr(expr: Expr.Grouping): unknown {
        return expr.Expression;
    }

    public VisitLiteralExpr(expr: Expr.Literal): unknown {
        return expr.Value;
    }

    public VisitUnaryExpr(expr: Expr.Unary): unknown {
        const right: unknown = this.Evaluate(expr.Right);

        switch (expr.Operator.Type) {
            case Syntax.BANG:
                return !this.IsTruthy(right);
            case Syntax.MINUS:
                this.CheckNumberOperand(expr.Operator, right);
                return -(right as number);
            case Syntax.PLUS:
                this.CheckNumberOperand(expr.Operator, right);
                return Math.abs(right as number);
        }

        return void 0;
    }

    public GetStyling(value: unknown): string | undefined {
        const strValue: string = this.Stringify(value);
        if (strValue === "null")
            return cyan(strValue);

        if (value instanceof Error)
            return red(strValue);

        switch (typeof value) {
            case "boolean":
                return yellow(strValue);
            case "number":
                return magenta(strValue);
            case "string":
                return green(`"${strValue}"`);
        }

        return strValue;
    }

    public Stringify(value: unknown): string {
        if (value === null || value === undefined)
            return "null";

        if (typeof value === "string")
            return value;

        if (typeof value === "number")
            return value.toString();

        // if (value instanceof Callable)
        //     return value.ToString();

        return (value as object).toString() || value as string;
    }

    private CheckNumberOperand(operator: Token, operand: unknown): void {
        if (typeof operand === "number")
            return;

        throw new RuntimeError(operator, "Operand must be a number.");
    }

    private CheckNumberOperands(operator: Token, left: unknown, right: unknown): void {
        if (typeof left === "number" && typeof right === "number")
            return;

        throw new RuntimeError(operator, "Operands must be numbers.");
    }

    private IsTruthy(value: unknown): boolean {
        if (value === null || value === undefined)
            return false;

        if (typeof value === "boolean")
            return value as boolean;

        return true;
    }

    private IsEqual(a: unknown, b: unknown): boolean {
        if ((a === null || a === undefined) || (b === null || b === undefined))
            return true;

        if (a === null || a === undefined)
            return false;

        return a === b;
    }
}