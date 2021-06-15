"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expr = void 0;
var Expr;
(function (Expr) {
    class Expression {
    }
    Expr.Expression = Expression;
    class Grouping extends Expression {
        constructor(Expression) {
            super();
            this.Expression = Expression;
        }
        Accept(visitor) {
            return visitor.VisitGrouping(this);
        }
    }
    Expr.Grouping = Grouping;
    class Literal extends Expression {
        constructor(Value) {
            super();
            this.Value = Value;
        }
        Accept(visitor) {
            return visitor.VisitLiteral(this);
        }
    }
    Expr.Literal = Literal;
    class Unary extends Expression {
        constructor(Operator, Right) {
            super();
            this.Operator = Operator;
            this.Right = Right;
        }
        Accept(visitor) {
            return visitor.VisitUnary(this);
        }
    }
    Expr.Unary = Unary;
    class Binary extends Expression {
        constructor(Left, Operator, Right) {
            super();
            this.Left = Left;
            this.Operator = Operator;
            this.Right = Right;
        }
        Accept(visitor) {
            return visitor.VisitBinary(this);
        }
    }
    Expr.Binary = Binary;
})(Expr = exports.Expr || (exports.Expr = {}));
