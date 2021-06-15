"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stmt = void 0;
var Stmt;
(function (Stmt) {
    class Statement {
    }
    Stmt.Statement = Statement;
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
})(Stmt = exports.Stmt || (exports.Stmt = {}));
