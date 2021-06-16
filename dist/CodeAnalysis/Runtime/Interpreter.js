"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = exports.Return = exports.RuntimeError = void 0;
const safe_1 = require("colors/safe");
const console_1 = require("console");
const Ether_1 = require("../../Ether");
const Statement_1 = require("../Syntax/Statement");
const SyntaxType_1 = require("../Syntax/SyntaxType");
const Environment_1 = require("./Environment");
const Boolean_1 = require("./Lib/Boolean");
const Input_1 = require("./Lib/Input");
const Number_1 = require("./Lib/Number");
const String_1 = require("./Lib/String");
const Time_1 = require("./Lib/Time");
const Wait_1 = require("./Lib/Wait");
const Warn_1 = require("./Lib/Warn");
const Method_1 = require("./Method");
const Resolver_1 = require("./Resolver");
const StringBuilder_1 = require("../../Utility/StringBuilder");
class RuntimeError extends EvalError {
    constructor(Token, message) {
        super(message);
        this.Token = Token;
    }
}
exports.RuntimeError = RuntimeError;
class Return extends RuntimeError {
    constructor(Value, token) {
        super(token, "A 'return' statement can only be used within a function body.");
        this.Value = Value;
    }
}
exports.Return = Return;
class Interpreter {
    constructor() {
        this.Globals = new Environment_1.Environment;
        this.environment = this.Globals;
        this.locals = new Map();
        this.Globals.Define("boolean", new Input_1.InputMethod);
        this.Globals.Define("input", new Boolean_1.BooleanMethod);
        this.Globals.Define("number", new Number_1.NumberMethod);
        this.Globals.Define("string", new String_1.StringMethod);
        this.Globals.Define("time", new Time_1.TimeMethod);
        this.Globals.Define("wait", new Wait_1.WaitMethod);
        this.Globals.Define("warn", new Warn_1.WarnMethod);
        this.Globals.Define("argv", ["ether", ...Ether_1.Ether.Args]);
        this.Globals.Define("__version", `Ether 1.4.0`);
    }
    Interpret(parser, repl) {
        try {
            this.Parser = parser;
            const statements = parser.Parse();
            if (Ether_1.Ether.HadError)
                return;
            const resolver = new Resolver_1.Resolver(this);
            resolver.Resolve(statements);
            if (Ether_1.Ether.HadError)
                return;
            for (const statement of statements)
                if (statement instanceof Statement_1.Stmt.Expression && repl === true) {
                    const value = this.Evaluate(statement.Expression);
                    console_1.log(this.GetStyling(value));
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
    Resolve(expr, depth) {
        this.locals.set(expr, depth);
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
    LookupVariable(name, expr) {
        const distance = this.locals.get(expr);
        if (distance !== undefined)
            return this.environment.GetAt(distance, name.Lexeme);
        else
            return this.Globals.Get(name);
    }
    IsCallable(value) {
        return value.Call !== undefined;
    }
    VisitReturnStmt(stmt) {
        let value = undefined;
        if (stmt.Value !== undefined)
            value = this.Evaluate(stmt.Value);
        throw new Return(value, stmt.Keyword);
    }
    VisitRaiseStmt(stmt) {
        const value = this.Evaluate(stmt.Expression);
        Ether_1.Ether.RaiseError(stmt.Token, this.Stringify(value));
    }
    VisitMethodStmt(stmt) {
        const method = new Method_1.Method(stmt, this.environment);
        this.environment.Define(stmt.Name.Lexeme, method);
    }
    VisitWhileStmt(stmt) {
        while (this.IsTruthy(this.Evaluate(stmt.Condition)))
            this.Execute(stmt.Body);
    }
    VisitIfStmt(stmt) {
        if (this.IsTruthy(this.Evaluate(stmt.Condition)))
            this.Execute(stmt.ThenBranch);
        else if (stmt.ElseBranch !== undefined)
            this.Execute(stmt.ElseBranch);
    }
    VisitBlockStmt(stmt) {
        this.ExecuteBlock(stmt.Statements, new Environment_1.Environment(this.environment));
    }
    VisitExpressionStmt(stmt) {
        this.Evaluate(stmt.Expression);
    }
    VisitPrintStmt(stmt) {
        const value = this.Evaluate(stmt.Expression);
        console_1.log(this.GetStyling(value) !== undefined ? this.GetStyling(value) : this.Stringify(value));
    }
    VisitGlobalVariableStmt(stmt) {
        let value;
        if (stmt.Initializer !== undefined)
            value = this.Evaluate(stmt.Initializer);
        this.Globals.Define(stmt.Name.Lexeme, value);
    }
    VisitVariableStmt(stmt) {
        let value;
        if (stmt.Initializer !== undefined)
            value = this.Evaluate(stmt.Initializer);
        this.environment.Define(stmt.Name.Lexeme, value);
    }
    VisitCallExpr(expr) {
        const callee = this.Evaluate(expr.Callee);
        const args = [];
        for (const arg of expr.Arguments)
            args.push(this.Evaluate(arg));
        const method = callee;
        if (!this.IsCallable(callee))
            throw new RuntimeError(expr.Paren, "Can only call methods and classes.");
        if (args.length != method.Arity())
            throw new RuntimeError(expr.Paren, `Expected ${method.Arity()} arguments, got ${args.length}.`);
        return method.Call(this, args);
    }
    VisitCompoundAssignExpr(expr) {
        const value = this.Evaluate(expr.Value);
        const variable = this.environment.Get(expr.Name);
        switch (expr.Operator.Type) {
            case SyntaxType_1.SyntaxType.PLUS_EQUAL: {
                if (typeof value === "number" && typeof variable === "number") {
                    this.environment.Assign(expr.Name, variable + value);
                    break;
                }
                else if (typeof value === "string" && typeof variable === "string") {
                    this.environment.Assign(expr.Name, variable + value);
                    break;
                }
                throw new RuntimeError(expr.Operator, `Expected two strings or two numbers, got ${typeof value} and ${typeof variable}.`);
            }
            case SyntaxType_1.SyntaxType.MINUS_EQUAL: {
                if (typeof value === "number" && typeof variable === "number") {
                    this.environment.Assign(expr.Name, variable - value);
                    break;
                }
                throw new RuntimeError(expr.Operator, `Expected two numbers, got ${typeof value} and ${typeof variable}.`);
            }
            case SyntaxType_1.SyntaxType.STAR_EQUAL: {
                if (typeof value === "number" && typeof variable === "number") {
                    this.environment.Assign(expr.Name, variable * value);
                    break;
                }
                throw new RuntimeError(expr.Operator, `Expected two numbers, got ${typeof value} and ${typeof variable}.`);
            }
            case SyntaxType_1.SyntaxType.SLASH_EQUAL: {
                if (typeof value === "number" && typeof variable === "number") {
                    this.environment.Assign(expr.Name, variable / value);
                    break;
                }
                throw new RuntimeError(expr.Operator, `Expected two numbers, got ${typeof value} and ${typeof variable}.`);
            }
            case SyntaxType_1.SyntaxType.CARAT_EQUAL: {
                if (typeof value === "number" && typeof variable === "number") {
                    this.environment.Assign(expr.Name, Math.pow(variable, value));
                    break;
                }
                throw new RuntimeError(expr.Operator, `Expected two numbers, got ${typeof value} and ${typeof variable}.`);
            }
            case SyntaxType_1.SyntaxType.PERCENT_EQUAL: {
                if (typeof value === "number" && typeof variable === "number") {
                    this.environment.Assign(expr.Name, variable % value);
                    break;
                }
                throw new RuntimeError(expr.Operator, `Expected two numbers, got ${typeof value} and ${typeof variable}.`);
            }
        }
        return this.environment.Get(expr.Name);
    }
    VisitLogicalExpr(expr) {
        const left = this.Evaluate(expr.Left);
        if (expr.Operator.Type === SyntaxType_1.SyntaxType.OR)
            if (this.IsTruthy(left))
                return left;
            else if (!this.IsTruthy(left))
                return left;
        return this.Evaluate(expr.Right);
    }
    VisitAssignExpr(expr) {
        const value = this.Evaluate(expr.Value);
        const distance = this.locals.get(expr);
        if (distance !== undefined)
            this.environment.AssignAt(distance, expr.Name, value);
        else
            this.Globals.Assign(expr.Name, value);
        return value;
    }
    VisitGlobalVariableExpr(expr) {
        return this.LookupVariable(expr.Name, expr);
    }
    VisitVariableExpr(expr) {
        return this.LookupVariable(expr.Name, expr);
    }
    VisitBinaryExpr(expr) {
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
            case SyntaxType_1.SyntaxType.PLUS:
                this.CheckNumberOperand(expr.Operator, right);
                return Math.abs(right);
        }
        return void 0;
    }
    GetStyling(value) {
        const strValue = this.Stringify(value);
        if (strValue === "null")
            return safe_1.cyan(strValue);
        if (value instanceof Error)
            return safe_1.red(strValue);
        if (value instanceof Array)
            return safe_1.yellow(strValue);
        switch (typeof value) {
            case "boolean":
                return safe_1.yellow(strValue);
            case "number":
                return safe_1.magenta(strValue);
            case "string":
                return safe_1.green(`"${strValue}"`);
        }
        return strValue;
    }
    Stringify(value) {
        if (value === null || value === undefined)
            return "null";
        if (typeof value === "string")
            return value;
        if (typeof value === "number")
            return value.toString();
        if (value.ToString !== undefined)
            return value.ToString();
        if (value instanceof Array) {
            const arrStr = new StringBuilder_1.StringBuilder;
            arrStr.Append("[ ");
            for (const v of value)
                arrStr.Append(this.GetStyling(v));
            arrStr.Append(" ]");
        }
        return value.toString() || value;
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
