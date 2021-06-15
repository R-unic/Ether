import { Token } from "./Token";

export namespace Expr {
    export abstract class Base {
        abstract Accept<R>(visitor: Visitor<R>): R
    }

    export interface Visitor<R> {
        VisitBinary(expr: Binary): R
        VisitGrouping(expr: Grouping): R
        VisitLiteral(expr: Literal): R
        VisitUnary(expr: Unary): R
    }

    export class Grouping extends Base {
        public constructor(
            public readonly Expression: Base
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitGrouping(this);
        }
    }

    export class Literal extends Base {
        public constructor(
            public readonly Value: unknown
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitLiteral(this);
        }
    }

    export class Unary extends Base {
        public constructor(
            public readonly Operator: Token,
            public readonly Right: Base
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitUnary(this);
        }
    }
    
    export class Binary extends Base {
        public constructor(
            public readonly Left: Base,
            public readonly Operator: Token,
            public readonly Right: Base
        ) {
            super();
        }

        public Accept<R>(visitor: Visitor<R>): R {
            return visitor.VisitBinary(this);
        }
    }
}