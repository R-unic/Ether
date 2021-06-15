import { Expr } from "./Expression";
import { Token } from "./Token";

export namespace Stmt {
    export abstract class Statement {
        abstract Accept<R>(visitor: Visitor<R>): R
    }

    export interface Visitor<R> {
        VisitBlockStmt(stmt: Block): R;
        VisitExpressionStmt(stmt: Expression): R;
        VisitIfStmt(stmt: If): R;
        VisitPrintStmt(stmt: Print): R;
        VisitReturnStmt(stmt: Return): R;
        VisitRaiseStmt(stmt: Raise): R;
        VisitMethodStmt(stmt: Method): R;
        VisitVariableStmt(stmt: Variable): R;
        VisitWhileStmt(stmt: While): R;
    }

    export class Block extends Statement {
        public constructor(
            public readonly Statements: Statement[]
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitBlockStmt(this);
        }
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
            public readonly ElseBranch?: Statement
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitIfStmt(this);
        }
    }

    export class Method extends Statement {
        public constructor(
            public readonly Name: Token,
            public readonly Params: Token[],
            public readonly Body: Stmt.Statement[]
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitMethodStmt(this);
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

    export class Raise extends Statement {
        public constructor(
            public readonly Token: Token,
            public readonly Expression: Expr.Expression
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitRaiseStmt(this);
        }
    }

    export class Return extends Statement {
        public constructor(
            public readonly Keyword: Token,
            public readonly Value: Expr.Expression
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitReturnStmt(this);
        }
    }

    export class Variable extends Statement {
        public constructor(
            public readonly Name: Token,
            public readonly Initializer: Expr.Expression | undefined
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitVariableStmt(this);
        }
    }

    export class While extends Statement {
        public constructor(
            public readonly Condition: Expr.Expression,
            public readonly Body: Statement
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitWhileStmt(this);
        }
    }
}