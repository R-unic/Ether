import { expect } from "chai";
import { Expr } from "../CodeAnalysis/Syntax/Expression";
import { Parser } from "../CodeAnalysis/Syntax/Parser";
import { Stmt } from "../CodeAnalysis/Syntax/Statement";
import { SyntaxType as Syntax } from "../CodeAnalysis/Syntax/SyntaxType";

describe("Parser", () => {
    describe("Binary operator test", () => {
        (() => {
            const parser = new Parser("true & false;");
            const statements: Stmt.Statement[] = parser.Parse();
            const binaryExprStatement = statements[0] as Stmt.Expression;
            const binaryExpression = binaryExprStatement.Expression as Expr.Logical;

            it("should produce a logical expression", () => {
                expect(binaryExpression).to.not.be.an("undefined");
                expect(binaryExpression).to.have.property("Left");
                expect(binaryExpression).to.have.property("Right");
                expect(binaryExpression).to.have.property("Operator");
            });
            it("should have the left evaluate to true and right to false", () => {
                expect(binaryExpression.Left).to.not.be.an("undefined");
                expect(binaryExpression.Right).to.not.be.an("undefined");
                expect(binaryExpression.Left as Expr.Literal).to.have.property("Value");
                expect(binaryExpression.Right as Expr.Literal).to.have.property("Value");
                expect((binaryExpression.Left as Expr.Literal).Value).to.equal(true);
                expect((binaryExpression.Right as Expr.Literal).Value).to.equal(false);
            })
            it("should have a & operator token", () => {
                expect(binaryExpression.Operator).to.not.be.an("undefined");
                expect(binaryExpression.Operator).to.have.property("Type");
                expect(binaryExpression.Operator).to.have.property("Lexeme");
                expect(binaryExpression.Operator).to.have.property("Line");
                expect(binaryExpression.Operator).to.have.property("Literal");
                expect(binaryExpression.Operator.Type).to.equal(Syntax.AND)
            });
        })();
        (() => {
            const parser = new Parser("false | true;");
            const statements: Stmt.Statement[] = parser.Parse();
            const binaryExprStatement = statements[0] as Stmt.Expression;
            const binaryExpression = binaryExprStatement.Expression as Expr.Logical;

            it("should produce a logical expression", () => {
                expect(binaryExpression).to.not.be.an("undefined");
                expect(binaryExpression).to.have.property("Left");
                expect(binaryExpression).to.have.property("Right");
                expect(binaryExpression).to.have.property("Operator");
            });
            it("should have the left evaluate to false and right to true", () => {
                expect(binaryExpression.Left).to.not.be.an("undefined");
                expect(binaryExpression.Right).to.not.be.an("undefined");
                expect(binaryExpression.Left as Expr.Literal).to.have.property("Value");
                expect(binaryExpression.Right as Expr.Literal).to.have.property("Value");
                expect((binaryExpression.Left as Expr.Literal).Value).to.equal(false);
                expect((binaryExpression.Right as Expr.Literal).Value).to.equal(true);
            })
            it("should have a | operator token", () => {
                expect(binaryExpression.Operator).to.not.be.an("undefined");
                expect(binaryExpression.Operator).to.have.property("Type");
                expect(binaryExpression.Operator).to.have.property("Lexeme");
                expect(binaryExpression.Operator).to.have.property("Line");
                expect(binaryExpression.Operator).to.have.property("Literal");
                expect(binaryExpression.Operator.Type).to.equal(Syntax.OR)
            });
        })();
        (() => {
            const parser = new Parser("2 + 4;");
            const statements: Stmt.Statement[] = parser.Parse();
            const binaryExprStatement = statements[0] as Stmt.Expression;
            const binaryExpression = binaryExprStatement.Expression as Expr.Binary;

            it("should produce a binary expression", () => {
                expect(binaryExpression).to.not.be.an("undefined");
                expect(binaryExpression).to.have.property("Left");
                expect(binaryExpression).to.have.property("Right");
                expect(binaryExpression).to.have.property("Operator");
            });
            it("should have the left evaluate to 2 and right to 4", () => {
                expect(binaryExpression.Left).to.not.be.an("undefined");
                expect(binaryExpression.Right).to.not.be.an("undefined");
                expect(binaryExpression.Left as Expr.Literal).to.have.property("Value");
                expect(binaryExpression.Right as Expr.Literal).to.have.property("Value");
                expect((binaryExpression.Left as Expr.Literal).Value).to.equal(2);
                expect((binaryExpression.Right as Expr.Literal).Value).to.equal(4);
            })
            it("should have a + operator token", () => {
                expect(binaryExpression.Operator).to.not.be.an("undefined");
                expect(binaryExpression.Operator).to.have.property("Type");
                expect(binaryExpression.Operator).to.have.property("Lexeme");
                expect(binaryExpression.Operator).to.have.property("Line");
                expect(binaryExpression.Operator).to.have.property("Literal");
                expect(binaryExpression.Operator.Type).to.equal(Syntax.PLUS)
            });
        })();
        (() => {
            const parser = new Parser("6 - 3 * 2;");
            const statements: Stmt.Statement[] = parser.Parse();
            const binaryExprStatement = statements[0] as Stmt.Expression;
            const binaryExpression = binaryExprStatement.Expression as Expr.Binary;

            it("should produce a binary expression", () => {
                expect(binaryExpression).to.not.be.an("undefined");
                expect(binaryExpression).to.have.property("Left");
                expect(binaryExpression).to.have.property("Right");
                expect(binaryExpression).to.have.property("Operator");
            });
            it("should have the left evaluate to 6 and right to binary(3 * 2)", () => {
                expect(binaryExpression.Left).to.not.be.an("undefined");
                expect(binaryExpression.Right).to.not.be.an("undefined");
                expect(binaryExpression.Left as Expr.Literal).to.have.property("Value");
                expect(binaryExpression.Right as Expr.Binary).to.have.property("Left");
                expect(binaryExpression.Right as Expr.Binary).to.have.property("Right");
                expect(binaryExpression.Right as Expr.Binary).to.have.property("Operator");
                expect((binaryExpression.Left as Expr.Literal).Value).to.equal(6);
                expect(((binaryExpression.Right as Expr.Binary).Left as Expr.Literal).Value).to.equal(3);
                expect(((binaryExpression.Right as Expr.Binary).Right as Expr.Literal).Value).to.equal(2);
                expect((binaryExpression.Right as Expr.Binary).Operator).to.have.property("Type");
                expect((binaryExpression.Right as Expr.Binary).Operator).to.have.property("Lexeme");
                expect((binaryExpression.Right as Expr.Binary).Operator).to.have.property("Line");
                expect((binaryExpression.Right as Expr.Binary).Operator).to.have.property("Literal");
                expect((binaryExpression.Right as Expr.Binary).Operator.Type).to.equal(Syntax.STAR);
            })
            it("should have a - operator token", () => {
                expect(binaryExpression.Operator).to.not.be.an("undefined");
                expect(binaryExpression.Operator).to.have.property("Type");
                expect(binaryExpression.Operator).to.have.property("Lexeme");
                expect(binaryExpression.Operator).to.have.property("Line");
                expect(binaryExpression.Operator).to.have.property("Literal");
                expect(binaryExpression.Operator.Type).to.equal(Syntax.MINUS)
            });
        })();
        (() => {
            const parser = new Parser("4 % 2 ^ 2;");
            const statements: Stmt.Statement[] = parser.Parse();
            const binaryExprStatement = statements[0] as Stmt.Expression;
            const binaryExpression = binaryExprStatement.Expression as Expr.Binary;

            it("should produce a binary expression", () => {
                expect(binaryExpression).to.not.be.an("undefined");
                expect(binaryExpression).to.have.property("Left");
                expect(binaryExpression).to.have.property("Right");
                expect(binaryExpression).to.have.property("Operator");
            });
            it("should have the left evaluate to 4 and right to binary(2 ^ 2)", () => {
                expect(binaryExpression.Left).to.not.be.an("undefined");
                expect(binaryExpression.Right).to.not.be.an("undefined");
                expect(binaryExpression.Left as Expr.Literal).to.have.property("Value");
                expect(binaryExpression.Right as Expr.Binary).to.have.property("Left");
                expect(binaryExpression.Right as Expr.Binary).to.have.property("Right");
                expect(binaryExpression.Right as Expr.Binary).to.have.property("Operator");
                expect((binaryExpression.Left as Expr.Literal).Value).to.equal(4);
                expect(((binaryExpression.Right as Expr.Binary).Left as Expr.Literal).Value).to.equal(2);
                expect(((binaryExpression.Right as Expr.Binary).Right as Expr.Literal).Value).to.equal(2);
                expect((binaryExpression.Right as Expr.Binary).Operator).to.have.property("Type");
                expect((binaryExpression.Right as Expr.Binary).Operator).to.have.property("Lexeme");
                expect((binaryExpression.Right as Expr.Binary).Operator).to.have.property("Line");
                expect((binaryExpression.Right as Expr.Binary).Operator).to.have.property("Literal");
                expect((binaryExpression.Right as Expr.Binary).Operator.Type).to.equal(Syntax.CARAT);
            })
            it("should have a % operator token", () => {
                expect(binaryExpression.Operator).to.not.be.an("undefined");
                expect(binaryExpression.Operator).to.have.property("Type");
                expect(binaryExpression.Operator).to.have.property("Lexeme");
                expect(binaryExpression.Operator).to.have.property("Line");
                expect(binaryExpression.Operator).to.have.property("Literal");
                expect(binaryExpression.Operator.Type).to.equal(Syntax.PERCENT)
            });
        })();
    });
    describe("Unary operator test", () => {
        (() => {
            const parser = new Parser("!true;");
            const statements: Stmt.Statement[] = parser.Parse();
            const unaryExprStatement = statements[0] as Stmt.Expression;
            const unaryExpression = unaryExprStatement.Expression as Expr.Unary;

            it("should produce a unary expression", () => {
                expect(unaryExpression).to.not.be.an("undefined");
                expect(unaryExpression).to.have.property("Right");
                expect(unaryExpression).to.have.property("Operator");
            });

            it("should have the operand evaluate to true", () => {
                expect(unaryExpression.Right).to.not.be.an("undefined");
                expect(unaryExpression.Right as Expr.Literal).to.have.property("Value");
                expect((unaryExpression.Right as Expr.Literal).Value).to.equal(true);
            })
            it("should have a ! operator token", () => {
                expect(unaryExpression.Operator).to.not.be.an("undefined");
                expect(unaryExpression.Operator).to.have.property("Type");
                expect(unaryExpression.Operator).to.have.property("Lexeme");
                expect(unaryExpression.Operator).to.have.property("Line");
                expect(unaryExpression.Operator).to.have.property("Literal");
                expect(unaryExpression.Operator.Type).to.equal(Syntax.BANG)
            });
        })();
        (() => {
            const parser = new Parser("-42;");
            const statements: Stmt.Statement[] = parser.Parse();
            const unaryExprStatement = statements[0] as Stmt.Expression;
            const unaryExpression = unaryExprStatement.Expression as Expr.Unary;

            it("should produce a unary expression", () => {
                expect(unaryExpression).to.not.be.an("undefined");
                expect(unaryExpression).to.have.property("Right");
                expect(unaryExpression).to.have.property("Operator");
            });

            it("should have the operand evaluate to 42", () => {
                expect(unaryExpression.Right).to.not.be.an("undefined");
                expect(unaryExpression.Right as Expr.Literal).to.have.property("Value");
                expect((unaryExpression.Right as Expr.Literal).Value).to.equal(42);
            })
            it("should have a - operator token", () => {
                expect(unaryExpression.Operator).to.not.be.an("undefined");
                expect(unaryExpression.Operator).to.have.property("Type");
                expect(unaryExpression.Operator).to.have.property("Lexeme");
                expect(unaryExpression.Operator).to.have.property("Line");
                expect(unaryExpression.Operator).to.have.property("Literal");
                expect(unaryExpression.Operator.Type).to.equal(Syntax.MINUS)
            });
        })();
        (() => {
            const parser = new Parser("+76;");
            const statements: Stmt.Statement[] = parser.Parse();
            const unaryExprStatement = statements[0] as Stmt.Expression;
            const unaryExpression = unaryExprStatement.Expression as Expr.Unary;

            it("should produce a unary expression", () => {
                expect(unaryExpression).to.not.be.an("undefined");
                expect(unaryExpression).to.have.property("Right");
                expect(unaryExpression).to.have.property("Operator");
            });

            it("should have the operand evaluate to 76", () => {
                expect(unaryExpression.Right).to.not.be.an("undefined");
                expect(unaryExpression.Right as Expr.Literal).to.have.property("Value");
                expect((unaryExpression.Right as Expr.Literal).Value).to.equal(76);
            })
            it("should have a + operator token", () => {
                expect(unaryExpression.Operator).to.not.be.an("undefined");
                expect(unaryExpression.Operator).to.have.property("Type");
                expect(unaryExpression.Operator).to.have.property("Lexeme");
                expect(unaryExpression.Operator).to.have.property("Line");
                expect(unaryExpression.Operator).to.have.property("Literal");
                expect(unaryExpression.Operator.Type).to.equal(Syntax.PLUS)
            });
        })();
    });
    describe("Error reporting test", () => {
        (() => {
            const parser = new Parser("print 5"); // Missing semicolon
            it("should raise an expected ';' error", () =>
                expect(parser.Parse).to.throw()
            );
        })();
        (() => {
            const parser = new Parser("raise 'Raised error';");
            it("should raise a 'Raised error' error", () =>
                expect(parser.Parse).to.throw()
            );
        })();
        (() => {
            const parser = new Parser("if (true)");
            it("should raise an expected '{' error", () =>
                expect(parser.Parse).to.throw()
            );
        })();
        (() => {
            const parser = new Parser("-false;");
            it("should raise a runtime error", () =>
                expect(parser.Parse).to.throw()
            );
        })();
        (() => {
            const parser = new Parser("return;");
            it("should raise a runtime error", () =>
                expect(parser.Parse).to.throw()
            );
        })();
        (() => {
            const parser = new Parser("method hello(name) { print 'hello ' + name ");
            it("should raise an expected '}' error", () =>
                expect(parser.Parse).to.throw()
            );
        })();
        (() => {
            const parser = new Parser("for (let i; i < 2) {}");
            it("should raise an expected ';' error", () =>
                expect(parser.Parse).to.throw()
            );
        })();
    });
});