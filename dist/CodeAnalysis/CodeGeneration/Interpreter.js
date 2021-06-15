"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = exports.RuntimeError = void 0;
const console_1 = require("console");
const Ether_1 = require("../../Ether");
const SyntaxType_1 = require("../Syntax/SyntaxType");
class RuntimeError extends EvalError {
    constructor(Token, message) {
        super(message);
        this.Token = Token;
    }
}
exports.RuntimeError = RuntimeError;
class Interpreter {
    Interpret(expression) {
        try {
            const value = this.Evaluate(expression);
            console_1.log(this.Stringify(value));
        }
        catch (err) {
            Ether_1.Ether.RuntimeError(err);
        }
    }
    Stringify(value) {
        if (value === null || value === undefined)
            return "null";
        if (typeof value === "number")
            return value.toString();
        return value.toString() || value;
    }
    VisitBinary(expr) {
        const left = this.Evaluate(expr.Left);
        const right = this.Evaluate(expr.Right);
        switch (expr.Operator.Type) {
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
    VisitGrouping(expr) {
        return expr.Expression;
    }
    VisitLiteral(expr) {
        return expr.Value;
    }
    VisitUnary(expr) {
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
    Evaluate(expr) {
        return expr.Accept(this);
    }
}
exports.Interpreter = Interpreter;
