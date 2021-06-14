"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTPrinter = void 0;
const StringBuilder_1 = require("./StringBuilder");
class ASTPrinter {
    Print(expr) {
        var _a;
        const tree = (_a = expr === null || expr === void 0 ? void 0 : expr.Accept(this)) !== null && _a !== void 0 ? _a : "null";
        console.log(tree);
    }
    VisitBinary(expr) {
        return this.Parenthesize(expr.Operator.Lexeme, expr.Left, expr.Right);
    }
    VisitGrouping(expr) {
        return this.Parenthesize("group", expr.Expression);
    }
    VisitLiteral(expr) {
        if (expr.Value === undefined)
            return "null";
        return expr.Value.toString() || expr.Value;
    }
    VisitUnary(expr) {
        return this.Parenthesize(expr.Operator.Lexeme, expr.Right);
    }
    Parenthesize(name, ...exprs) {
        const builder = new StringBuilder_1.StringBuilder;
        builder.Append("(").Append(name);
        for (const expr of exprs) {
            builder.Append(" ");
            builder.Append(expr.Accept(this));
        }
        builder.Append(")");
        return builder.ToString();
    }
}
exports.ASTPrinter = ASTPrinter;
