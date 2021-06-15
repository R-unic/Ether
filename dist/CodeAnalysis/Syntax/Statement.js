"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stmt = void 0;
var Stmt;
(function (Stmt) {
    class Statement {
    }
    Stmt.Statement = Statement;
    class Block extends Statement {
        constructor(Statements) {
            super();
            this.Statements = Statements;
        }
        Accept(visitor) {
            return visitor.VisitBlockStmt(this);
        }
    }
    Stmt.Block = Block;
    class Expression extends Statement {
        constructor(Expression) {
            super();
            this.Expression = Expression;
        }
        Accept(visitor) {
            return visitor.VisitExpressionStmt(this);
        }
    }
    Stmt.Expression = Expression;
    class If extends Statement {
        constructor(Condition, ThenBranch, ElseBranch) {
            super();
            this.Condition = Condition;
            this.ThenBranch = ThenBranch;
            this.ElseBranch = ElseBranch;
        }
        Accept(visitor) {
            return visitor.VisitIfStmt(this);
        }
    }
    Stmt.If = If;
    class Print extends Statement {
        constructor(Expression) {
            super();
            this.Expression = Expression;
        }
        Accept(visitor) {
            return visitor.VisitPrintStmt(this);
        }
    }
    Stmt.Print = Print;
    class Variable extends Statement {
        constructor(Name, Initializer) {
            super();
            this.Name = Name;
            this.Initializer = Initializer;
        }
        Accept(visitor) {
            return visitor.VisitVariableStmt(this);
        }
    }
    Stmt.Variable = Variable;
    class While extends Statement {
        constructor(Condition, Body) {
            super();
            this.Condition = Condition;
            this.Body = Body;
        }
        Accept(visitor) {
            return visitor.VisitWhileStmt(this);
        }
    }
    Stmt.While = While;
})(Stmt = exports.Stmt || (exports.Stmt = {}));
