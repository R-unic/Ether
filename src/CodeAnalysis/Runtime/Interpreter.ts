import { log } from "console";
import { Ether } from "../../Ether";
import { Expr } from "../Syntax/Expression";
import { Stmt } from "../Syntax/Statement";
import { SyntaxType as Syntax } from "../Syntax/SyntaxType";
import { Token } from "../Syntax/Token";
import { Environment } from "./Environment";

export class RuntimeError extends EvalError {
    public constructor(
        public readonly Token: Token, 
        message?: string
    ) {
        super(message);
    }
}

export class Interpreter implements Expr.Visitor<unknown>, Stmt.Visitor<void> {
    private environment = new Environment;

    public Interpret(statements: Stmt.Statement[], repl: boolean): void {
        try {
            for(const statement of statements)
                if (statement instanceof Stmt.Expression && repl === true) {
                    const value: unknown = this.Evaluate(statement.Expression);
                    log(this.Stringify(value));
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

    private ExecuteBlock(statements: Stmt.Statement[], environment: Environment): void {
        const previous: Environment = this.environment;

        try {
            this.environment = environment;

            for (const statement of statements)
                this.Execute(statement);
        } finally {
            this.environment = previous;
        }
    }

    public VisitBlockStmt(stmt: Stmt.Block): void {
        this.ExecuteBlock(stmt.Statements, new Environment(this.environment));
    }

    public VisitExpressionStmt(stmt: Stmt.Expression): void {
        this.Evaluate(stmt.Expression);
    }

    public VisitIfStmt(stmt: Stmt.If): void {
        throw new Error("Method not implemented.");
    }

    public VisitPrintStmt(stmt: Stmt.Print): void {
        const value: unknown = this.Evaluate(stmt.Expression);
        log(this.Stringify(value));
    }

    public VisitVariableStmt(stmt: Stmt.Variable): void {
        let value: unknown;
        if (stmt.Initializer !== undefined)
            value = this.Evaluate(stmt.Initializer);

        this.environment.Define(stmt.Name.Lexeme, value);
    }
    
    public VisitWhileStmt(stmt: Stmt.While): void {
        throw new Error("Method not implemented.");
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
            case Syntax.AND: 
                this.CheckBooleanOperands(expr.Operator, left, right);
                return (left as boolean) && (right as boolean);
            case Syntax.OR:
                this.CheckBooleanOperands(expr.Operator, left, right);
                return (left as boolean) || (right as boolean);

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
                this.CheckNumberOperand(expr.Operator, right)
                return -(right as number)
        }

        return void 0;
    }

    private Stringify(value: unknown): string {
        if (value === null || value === undefined)
            return "null";

        if (typeof value === "number")
            return value.toString();

        return value as string || (value as object).toString();
    }

    private CheckBooleanOperand(operator: Token, operand: unknown): void {
        if (typeof operand === "boolean")
            return;

        throw new RuntimeError(operator, "Operand must be a boolean.");
    }

    private CheckBooleanOperands(operator: Token, left: unknown, right: unknown): void {
        if (typeof left === "boolean" && typeof right === "boolean")
            return;

        throw new RuntimeError(operator, "Operands must be booleans.");
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