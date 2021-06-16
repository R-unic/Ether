import { Ether } from "../../Ether";
import { Stack } from "../../Utility/Stack";
import { Expr } from "../Syntax/Expression";
import { Stmt } from "../Syntax/Statement";
import { Token } from "../Syntax/Token";
import { Interpreter } from "./Interpreter";
import { MethodType } from "./MethodType";

export class Resolver implements Expr.Visitor<void>, Stmt.Visitor<void> {
    private readonly scopes = new Stack<Map<string, boolean>>()
    private currentMethod = MethodType.NONE;

    public constructor(
        private readonly interpreter: Interpreter
    ) {}

    public Resolve(statements: Stmt.Statement | Stmt.Statement[] | Expr.Expression): void {
        if (statements instanceof Array)
            (statements as Stmt.Statement[]).forEach(statement => this.Resolve(statement));
        else if (statements instanceof Stmt.Statement)
            (statements as Stmt.Statement).Accept(this);
        else if (statements instanceof Expr.Expression)  
            (statements as Expr.Expression).Accept(this);
    }

    private ResolveMethod(method: Stmt.Method, type: MethodType): void {
        const enclosingMethod: MethodType = this.currentMethod;
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

    private ResolveGlobal(expr: Expr.Expression, name: Token): void {        
        for (let i = this.scopes.Size; i >= 0; i--)
            this.interpreter.Resolve(expr, 0);
    }

    private ResolveLocal(expr: Expr.Expression, name: Token): void {        
        for (let i = this.scopes.Size; i >= 0; i--)
            if (this.scopes.Get(i)?.has(name.Lexeme)) {
                this.interpreter.Resolve(expr, this.scopes.Size - i);
                return;
            }    
    }

    private BeginScope(): void {
        this.scopes.Push(new Map<string, boolean>());
    }

    private EndScope(): void {
        this.scopes.Pop();
    }
    
    private Declare(name: Token): void {
        if (this.scopes.Empty)
            return;
        
        const scope: Map<string, boolean> | undefined = this.scopes.Peek();
        if (scope?.has(name.Lexeme))
            Ether.Error(name, `Variable '${name.Lexeme}' is already declared in this scope.`);

        scope?.set(name.Lexeme, false);
    }

    private Define(name: Token): void {
        if (this.scopes.Empty)
            return;

        this.scopes.Peek()?.set(name.Lexeme, true);
    }

    public VisitBlockStmt(stmt: Stmt.Block): void {
        this.BeginScope();
        this.Resolve(stmt.Statements);
        this.EndScope();
    }

    public VisitExpressionStmt(stmt: Stmt.Expression): void {
        this.Resolve(stmt.Expression);
    }

    public VisitGlobalVariableStmt(stmt: Stmt.Global): void {
        this.Declare(stmt.Name);
        if (stmt.Initializer !== undefined)
            this.Resolve(stmt.Initializer);

        this.Define(stmt.Name);
    }

    public VisitIfStmt(stmt: Stmt.If): void {
        this.Resolve(stmt.Condition);
        this.Resolve(stmt.ThenBranch);
        if (stmt.ElseBranch !== undefined)
            this.Resolve(stmt.ElseBranch);
    }

    public VisitPrintStmt(stmt: Stmt.Print): void {
        this.Resolve(stmt.Expression);
    }

    public VisitReturnStmt(stmt: Stmt.Return): void {
        if (this.currentMethod === MethodType.NONE)
            Ether.Error(stmt.Keyword, "A 'return' statement can only be used within a method body.")

        if (stmt.Value !== undefined)
            this.Resolve(stmt.Value);
    }

    public VisitRaiseStmt(stmt: Stmt.Raise): void {
        this.Resolve(stmt.Expression);
    }

    public VisitMethodStmt(stmt: Stmt.Method): void {
        this.Declare(stmt.Name);
        this.Define(stmt.Name);
        this.ResolveMethod(stmt, MethodType.METHOD);
    }

    public VisitVariableStmt(stmt: Stmt.Variable): void {
        this.Declare(stmt.Name);
        if (stmt.Initializer !== undefined)
            this.Resolve(stmt.Initializer);

        this.Define(stmt.Name);
    }

    public VisitWhileStmt(stmt: Stmt.While): void {
        this.Resolve(stmt.Condition);
        this.Resolve(stmt.Body);
    }

    public VisitAssignExpr(expr: Expr.Assign): void {
        this.Resolve(expr.Value);
        this.ResolveLocal(expr, expr.Name);
    }

    public VisitCallExpr(expr: Expr.Call): void {
        this.Resolve(expr.Callee);
        for (const arg of expr.Arguments)
            this.Resolve(arg);
    }

    public VisitCompoundAssignExpr(expr: Expr.CompoundAssign): void {
        this.Resolve(expr.Value);
        this.ResolveLocal(expr, expr.Name);
    }

    public VisitBinaryExpr(expr: Expr.Binary): void {
        this.Resolve(expr.Left);
        this.Resolve(expr.Right);
    }

    public VisitGlobalVariableExpr(expr: Expr.Global): void {
        if (!this.scopes.Empty && this.scopes.Peek()?.get(expr.Name.Lexeme) === false)
            Ether.Error(expr.Name, "Cannot read global variable in it's own initializer");

        this.ResolveGlobal(expr, expr.Name);
    }

    public VisitVariableExpr(expr: Expr.Variable): void {
        if (!this.scopes.Empty && this.scopes.Peek()?.get(expr.Name.Lexeme) === false)
            Ether.Error(expr.Name, "Cannot read local variable in it's own initializer");

        this.ResolveLocal(expr, expr.Name);
    }

    public VisitGroupingExpr(expr: Expr.Grouping): void {
        this.Resolve(expr.Expression);
    }

    public VisitLiteralExpr(expr: Expr.Literal): void {
        // Literally do nothing for literals
    }

    public VisitLogicalExpr(expr: Expr.Logical): void {
        this.Resolve(expr.Left);
        this.Resolve(expr.Right);
    }

    public VisitUnaryExpr(expr: Expr.Unary): void {
        this.Resolve(expr.Right);
    }
}