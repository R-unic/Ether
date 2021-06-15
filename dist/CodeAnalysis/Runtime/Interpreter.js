"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = exports.RuntimeError = void 0;
const console_1 = require("console");
const Ether_1 = require("../../Ether");
const Statement_1 = require("../Syntax/Statement");
const SyntaxType_1 = require("../Syntax/SyntaxType");
const Environment_1 = require("./Environment");
class RuntimeError extends EvalError {
    constructor(Token, message) {
        super(message);
        this.Token = Token;
    }
}
exports.RuntimeError = RuntimeError;
class Interpreter {
    constructor() {
        this.environment = new Environment_1.Environment;
    }
    Interpret(statements, repl) {
        try {
            for (const statement of statements)
                if (statement instanceof Statement_1.Stmt.Expression && repl === true) {
                    const value = this.Evaluate(statement.Expression);
                    console_1.log(this.Stringify(value));
                }
                else
                    this.Execute(statement);
        }
        catch (err) {
            Ether_1.Ether.RuntimeError(err);
        }
    }
    Evaluate(expr) {
        return expr.Accept(this);
    }
    Execute(stmt) {
        stmt.Accept(this);
    }
    ExecuteBlock(statements, environment) {
        const previous = this.environment;
        try {
            this.environment = environment;
            for (const statement of statements)
                this.Execute(statement);
        }
        finally {
            this.environment = previous;
        }
    }
    VisitBlockStmt(stmt) {
        this.ExecuteBlock(stmt.Statements, new Environment_1.Environment(this.environment));
    }
    VisitExpressionStmt(stmt) {
        this.Evaluate(stmt.Expression);
    }
    VisitIfStmt(stmt) {
        throw new Error("Method not implemented.");
    }
    VisitPrintStmt(stmt) {
        const value = this.Evaluate(stmt.Expression);
        console_1.log(this.Stringify(value));
    }
    VisitVariableStmt(stmt) {
        let value;
        if (stmt.Initializer !== undefined)
            value = this.Evaluate(stmt.Initializer);
        this.environment.Define(stmt.Name.Lexeme, value);
    }
    VisitWhileStmt(stmt) {
        throw new Error("Method not implemented.");
    }
    VisitAssignExpr(expr) {
        const value = this.Evaluate(expr.Value);
        this.environment.Assign(expr.Name, value);
        return value;
    }
    VisitVariableExpr(expr) {
        return this.environment.Get(expr.Name);
    }
    VisitBinaryExpr(expr) {
        const left = this.Evaluate(expr.Left);
        const right = this.Evaluate(expr.Right);
        switch (expr.Operator.Type) {
            case SyntaxType_1.SyntaxType.AND:
                this.CheckBooleanOperands(expr.Operator, left, right);
                return left && right;
            case SyntaxType_1.SyntaxType.OR:
                this.CheckBooleanOperands(expr.Operator, left, right);
                return left || right;
            case SyntaxType_1.SyntaxType.BANG_EQUAL: return !this.IsEqual(left, right);
            case SyntaxType_1.SyntaxType.EQUAL_EQUAL: return this.IsEqual(left, right);
            case SyntaxType_1.SyntaxType.GREATER:
                this.CheckNumberOperands(expr.Operator, left, right);
                return left > right;
            case SyntaxType_1.SyntaxType.GREATER_EQUAL:
                this.CheckNumberOperands(expr.Operator, left, right);
                return left >= right;
            case SyntaxType_1.SyntaxType.LESS:
                this.CheckNumberOperands(expr.Operator, left, right);
                return left < right;
            case SyntaxType_1.SyntaxType.LESS_EQUAL:
                return left <= right;
            case SyntaxType_1.SyntaxType.PLUS: {
                if (typeof left === "number" && typeof right === "number")
                    return left + right;
                if (typeof left === "string" && typeof right === "string")
                    return left + right;
                throw new RuntimeError(expr.Operator, "Operands must be two numbers or two strings.");
            }
            case SyntaxType_1.SyntaxType.MINUS:
                this.CheckNumberOperands(expr.Operator, left, right);
                return left - right;
            case SyntaxType_1.SyntaxType.SLASH:
                this.CheckNumberOperands(expr.Operator, left, right);
                return left / right;
            case SyntaxType_1.SyntaxType.STAR:
                this.CheckNumberOperands(expr.Operator, left, right);
                return left * right;
            case SyntaxType_1.SyntaxType.CARAT:
                this.CheckNumberOperands(expr.Operator, left, right);
                return Math.pow(left, right);
            case SyntaxType_1.SyntaxType.PERCENT:
                this.CheckNumberOperands(expr.Operator, left, right);
                return left % right;
        }
        return void 0;
    }
    VisitGroupingExpr(expr) {
        return expr.Expression;
    }
    VisitLiteralExpr(expr) {
        return expr.Value;
    }
    VisitUnaryExpr(expr) {
        const right = this.Evaluate(expr.Right);
        switch (expr.Operator.Type) {
            case SyntaxType_1.SyntaxType.BANG:
                return !this.IsTruthy(right);
            case SyntaxType_1.SyntaxType.MINUS:
                this.CheckNumberOperand(expr.Operator, right);
                return -right;
        }
        return void 0;
    }
    Stringify(value) {
        if (value === null || value === undefined)
            return "null";
        if (typeof value === "number")
            return value.toString();
        return value || value.toString();
    }
    CheckBooleanOperand(operator, operand) {
        if (typeof operand === "boolean")
            return;
        throw new RuntimeError(operator, "Operand must be a boolean.");
    }
    CheckBooleanOperands(operator, left, right) {
        if (typeof left === "boolean" && typeof right === "boolean")
            return;
        throw new RuntimeError(operator, "Operands must be booleans.");
    }
    CheckNumberOperand(operator, operand) {
        if (typeof operand === "number")
            return;
        throw new RuntimeError(operator, "Operand must be a number.");
    }
    CheckNumberOperands(operator, left, right) {
        if (typeof left === "number" && typeof right === "number")
            return;
        throw new RuntimeError(operator, "Operands must be numbers.");
    }
    IsTruthy(value) {
        if (value === null || value === undefined)
            return false;
        if (typeof value === "boolean")
            return value;
        return true;
    }
    IsEqual(a, b) {
        if ((a === null || a === undefined) || (b === null || b === undefined))
            return true;
        if (a === null || a === undefined)
            return false;
        return a === b;
    }
}
exports.Interpreter = Interpreter;
