import { Expr } from "../SyntaxAnalysis/Expression";
import { StringBuilder } from "./StringBuilder";

export class ASTPrinter implements Expr.Visitor<string> {
    public Print(expr?: Expr.Base): void {
        const tree: string = expr?.Accept<string>(this)?? "null";
        console.log(tree);
    }

    public VisitBinary(expr: Expr.Binary): string {
        return this.Parenthesize(expr.Operator.Lexeme, expr.Left, expr.Right);
    }

    public VisitGrouping(expr: Expr.Grouping): string {
        return this.Parenthesize("group", expr.Expression);
    }

    public VisitLiteral(expr: Expr.Literal): string {
        if (expr.Value === undefined)
            return "null";

        return (expr.Value as object).toString() || expr.Value as string;
    }

    public VisitUnary(expr: Expr.Unary): string {
        return this.Parenthesize(expr.Operator.Lexeme, expr.Right);
    }

    private Parenthesize(name: string, ...exprs: Expr.Base[]): string {
        const builder = new StringBuilder;

        builder.Append("(").Append(name);
        for (const expr of exprs) {
            builder.Append(" ");
            builder.Append(expr.Accept(this));
        }
        builder.Append(")");

        return builder.ToString();
    }
}