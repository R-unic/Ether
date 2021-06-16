"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = void 0;
const Ether_1 = require("../../Ether");
const Stack_1 = require("../../Utility/Stack");
const Expression_1 = require("../Syntax/Expression");
const Statement_1 = require("../Syntax/Statement");
const MethodType_1 = require("./MethodType");
class Resolver {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.scopes = new Stack_1.Stack();
        this.currentMethod = MethodType_1.MethodType.NONE;
    }
    Resolve(statements) {
        if (statements instanceof Array)
            statements.forEach(statement => this.Resolve(statement));
        else if (statements instanceof Statement_1.Stmt.Statement)
            statements.Accept(this);
        else if (statements instanceof Expression_1.Expr.Expression)
            statements.Accept(this);
    }
    ResolveMethod(method, type) {
        const enclosingMethod = this.currentMethod;
        this.currentMethod = type;
        this.BeginScope();
        for (const param of method.Params) {
            this.Declare(param);
            this.Define(param);
        }
        this.Resolve(method.Body);
        this.EndScope();
        this.currentMethod = enclosingMethod;
    }
    ResolveGlobal(expr, name) {
        for (let i = this.scopes.Size; i >= 0; i--)
            this.interpreter.Resolve(expr, 0);
    }
    ResolveLocal(expr, name) {
        var _a;
        for (let i = this.scopes.Size; i >= 0; i--)
            if ((_a = this.scopes.Get(i)) === null || _a === void 0 ? void 0 : _a.has(name.Lexeme)) {
                this.interpreter.Resolve(expr, this.scopes.Size - i);
                return;
            }
    }
    BeginScope() {
        this.scopes.Push(new Map());
    }
    EndScope() {
        this.scopes.Pop();
    }
    Declare(name) {
        if (this.scopes.Empty)
            return;
        const scope = this.scopes.Peek();
        if (scope === null || scope === void 0 ? void 0 : scope.has(name.Lexeme))
            Ether_1.Ether.Error(name, `Variable '${name.Lexeme}' is already declared in this scope.`);
        scope === null || scope === void 0 ? void 0 : scope.set(name.Lexeme, false);
    }
    Define(name) {
        var _a;
        if (this.scopes.Empty)
            return;
        (_a = this.scopes.Peek()) === null || _a === void 0 ? void 0 : _a.set(name.Lexeme, true);
    }
    VisitBlockStmt(stmt) {
        this.BeginScope();
        this.Resolve(stmt.Statements);
        this.EndScope();
    }
    VisitExpressionStmt(stmt) {
        this.Resolve(stmt.Expression);
    }
    VisitGlobalVariableStmt(stmt) {
        this.Declare(stmt.Name);
        if (stmt.Initializer !== undefined)
            this.Resolve(stmt.Initializer);
        this.Define(stmt.Name);
    }
    VisitIfStmt(stmt) {
        this.Resolve(stmt.Condition);
        this.Resolve(stmt.ThenBranch);
        if (stmt.ElseBranch !== undefined)
            this.Resolve(stmt.ElseBranch);
    }
    VisitPrintStmt(stmt) {
        this.Resolve(stmt.Expression);
    }
    VisitReturnStmt(stmt) {
        if (this.currentMethod === MethodType_1.MethodType.NONE)
            Ether_1.Ether.Error(stmt.Keyword, "A 'return' statement can only be used within a method body.");
        if (stmt.Value !== undefined)
            this.Resolve(stmt.Value);
    }
    VisitRaiseStmt(stmt) {
        this.Resolve(stmt.Expression);
    }
    VisitMethodStmt(stmt) {
        this.Declare(stmt.Name);
        this.Define(stmt.Name);
        this.ResolveMethod(stmt, MethodType_1.MethodType.METHOD);
    }
    VisitVariableStmt(stmt) {
        this.Declare(stmt.Name);
        if (stmt.Initializer !== undefined)
            this.Resolve(stmt.Initializer);
        this.Define(stmt.Name);
    }
    VisitWhileStmt(stmt) {
        this.Resolve(stmt.Condition);
        this.Resolve(stmt.Body);
    }
    VisitAssignExpr(expr) {
        this.Resolve(expr.Value);
        this.ResolveLocal(expr, expr.Name);
    }
    VisitCallExpr(expr) {
        this.Resolve(expr.Callee);
        for (const arg of expr.Arguments)
            this.Resolve(arg);
    }
    VisitCompoundAssignExpr(expr) {
        this.Resolve(expr.Value);
        this.ResolveLocal(expr, expr.Name);
    }
    VisitBinaryExpr(expr) {
        this.Resolve(expr.Left);
        this.Resolve(expr.Right);
    }
    VisitGlobalVariableExpr(expr) {
        var _a;
        if (!this.scopes.Empty && ((_a = this.scopes.Peek()) === null || _a === void 0 ? void 0 : _a.get(expr.Name.Lexeme)) === false)
            Ether_1.Ether.Error(expr.Name, "Cannot read global variable in it's own initializer");
        this.ResolveGlobal(expr, expr.Name);
    }
    VisitVariableExpr(expr) {
        var _a;
        if (!this.scopes.Empty && ((_a = this.scopes.Peek()) === null || _a === void 0 ? void 0 : _a.get(expr.Name.Lexeme)) === false)
            Ether_1.Ether.Error(expr.Name, "Cannot read local variable in it's own initializer");
        this.ResolveLocal(expr, expr.Name);
    }
    VisitGroupingExpr(expr) {
        this.Resolve(expr.Expression);
    }
    VisitLiteralExpr(expr) {
        // Literally do nothing for literals
    }
    VisitLogicalExpr(expr) {
        this.Resolve(expr.Left);
        this.Resolve(expr.Right);
    }
    VisitUnaryExpr(expr) {
        this.Resolve(expr.Right);
    }
}
exports.Resolver = Resolver;
