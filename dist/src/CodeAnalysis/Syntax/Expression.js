"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expr = void 0;
var Expr;
(function (Expr) {
    class Expression {
    }
    Expr.Expression = Expression;
    class Call extends Expression {
        constructor(Callee, Paren, Arguments) {
            super();
            this.Callee = Callee;
            this.Paren = Paren;
            this.Arguments = Arguments;
        }
        Accept(visitor) {
            return visitor.VisitCallExpr(this);
        }
    }
    Expr.Call = Call;
    class Logical extends Expression {
        constructor(Left, Operator, Right) {
            super();
            this.Left = Left;
            this.Operator = Operator;
            this.Right = Right;
        }
        Accept(visitor) {
            return visitor.VisitLogicalExpr(this);
        }
    }
    Expr.Logical = Logical;
    class Assign extends Expression {
        constructor(Name, Value) {
            super();
            this.Name = Name;
            this.Value = Value;
        }
        Accept(visitor) {
            return visitor.VisitAssignExpr(this);
        }
    }
    Expr.Assign = Assign;
    class Variable extends Expression {
        constructor(Name) {
            super();
            this.Name = Name;
        }
        Accept(visitor) {
            return visitor.VisitVariableExpr(this);
        }
    }
    Expr.Variable = Variable;
    class Grouping extends Expression {
        constructor(Expression) {
            super();
            this.Expression = Expression;
        }
        Accept(visitor) {
            return visitor.VisitGroupingExpr(this);
        }
    }
    Expr.Grouping = Grouping;
    class Literal extends Expression {
        constructor(Value) {
            super();
            this.Value = Value;
        }
        Accept(visitor) {
            return visitor.VisitLiteralExpr(this);
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
            return visitor.VisitUnaryExpr(this);
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
            return visitor.VisitBinaryExpr(this);
        }
    }
    Expr.Binary = Binary;
})(Expr = exports.Expr || (exports.Expr = {}));
