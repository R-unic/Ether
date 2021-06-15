import { log } from "console";
import { Ether } from "../../Ether";
import { Expr } from "../Syntax/Expression";
import { SyntaxType } from "../Syntax/SyntaxType";
import { Token } from "../Syntax/Token";

export class RuntimeError extends EvalError {
    public constructor(
        public readonly Token: Token, 
        message?: string
    ) {
        super(message);
    }
}

export class Interpreter implements Expr.Visitor<unknown> {
    public Interpret(expression: Expr.Base): void {
        try {
            const value: unknown = this.Evaluate(expression);
            log(this.Stringify(value))
        } catch (err) {
            Ether.RuntimeError(err as RuntimeError);
        }
    }

    private Stringify(value: unknown): string {
        if (value === null || value === undefined)
            return "null";

        if (typeof value === "number")
            return value.toString();

        return (value as object).toString() || value as string;
    }

    public VisitBinary(expr: Expr.Binary): unknown {
        const left: unknown = this.Evaluate(expr.Left);
        const right: unknown = this.Evaluate(expr.Right);

        switch (expr.Operator.Type) {
            case SyntaxType.BANG_EQUAL: return !this.IsEqual(left, right);
            case SyntaxType.EQUAL_EQUAL: return this.IsEqual(left, right);
            case SyntaxType.GREATER:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) > (right as number);
            case SyntaxType.GREATER_EQUAL:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) >= (right as number);
            case SyntaxType.LESS:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) < (right as number);
            case SyntaxType.LESS_EQUAL:
                return (left as number) <= (right as number);

            case SyntaxType.PLUS: {
                if (typeof left === "number" && typeof right === "number")
                    return (left as number) + (right as number);

                if (typeof left === "string" && typeof right === "string")
                    return (left as string) + (right as string);

                throw new RuntimeError(expr.Operator, "Operands must be two numbers or two strings.");
            }
                
            case SyntaxType.MINUS:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) - (right as number);
            case SyntaxType.SLASH:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) / (right as number);
            case SyntaxType.STAR:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) * (right as number);
            case SyntaxType.CARAT:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) ** (right as number);
            case SyntaxType.PERCENT:
                this.CheckNumberOperands(expr.Operator, left, right);
                return (left as number) % (right as number);
        }

        return void 0;
    }
    

    public VisitGrouping(expr: Expr.Grouping): unknown {
        return expr.Expression;
    }

    public VisitLiteral(expr: Expr.Literal): unknown {
        return expr.Value;
    }

    public VisitUnary(expr: Expr.Unary): unknown {
        const right: unknown = this.Evaluate(expr.Right);

        switch (expr.Operator.Type) {
            case SyntaxType.BANG:
                return !this.IsTruthy(right);
            case SyntaxType.MINUS:
                this.CheckNumberOperand(expr.Operator, right)
                return -(right as number)
        }

        return void 0;
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

    public IsEqual(a: unknown, b: unknown): boolean {
        if ((a === null || a === undefined) || (b === null || b === undefined))
            return true;

        if (a === null || a === undefined)
            return false;

        return a === b;
    }

    private Evaluate(expr: Expr.Base): unknown {
        return expr.Accept<unknown>(this);
    }
}