import { Token } from "./Token";

export namespace Expr {
    export abstract class Expression {
        abstract Accept<R>(visitor: Visitor<R>): R
    }

    export interface Visitor<R> {
        VisitAssignExpr(expr: Assign): R
        VisitBinaryExpr(expr: Binary): R;
        VisitGroupingExpr(expr: Grouping): R;
        VisitLiteralExpr(expr: Literal): R;
        VisitUnaryExpr(expr: Unary): R;
        VisitVariableExpr(expr: Variable): R;
    }

    export class Assign extends Expression {
        public constructor(
            public readonly Name: Token,
            public readonly Value: Expression
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitAssignExpr(this);
        }
    }

    export class Variable extends Expression {
        public constructor(
            public readonly Name: Token
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitVariableExpr(this);
        }
    }

    export class Grouping extends Expression {
        public constructor(
            public readonly Expression: Expression
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitGroupingExpr(this);
        }
    }

    export class Literal extends Expression {
        public constructor(
            public readonly Value: unknown
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitLiteralExpr(this);
        }
    }

    export class Unary extends Expression {
        public constructor(
            public readonly Operator: Token,
            public readonly Right: Expression
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitUnaryExpr(this);
        }
    }
    
    export class Binary extends Expression {
        public constructor(
            public readonly Left: Expression,
            public readonly Operator: Token,
            public readonly Right: Expression
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitBinaryExpr(this);
        }
    }
}