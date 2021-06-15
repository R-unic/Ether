import { Expr } from "./Expression";

export namespace Stmt {
    export abstract class Statement {
        abstract Accept<R>(visitor: Visitor<R>): R
    }

    export interface Visitor<R> {
        VisitExpressionStmt(stmt: Expression): R;
        VisitIfStmt(stmt: If): R;
        VisitPrintStmt(stmt: Print): R;
    }

    export class Expression extends Statement {
        public constructor(
            public readonly Expression: Expr.Expression
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitExpressionStmt(this);
        }
    }

    export class If extends Statement {
        public constructor(
            public readonly Condition: Expr.Expression,
            public readonly ThenBranch: Statement,
            public readonly ElseBranch: Statement
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitIfStmt(this);
        }
    }

    export class Print extends Statement {
        public constructor(
            public readonly Expression: Expr.Expression
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitPrintStmt(this);
        }
    }
}