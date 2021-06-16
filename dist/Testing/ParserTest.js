"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Parser_1 = require("../CodeAnalysis/Syntax/Parser");
const SyntaxType_1 = require("../CodeAnalysis/Syntax/SyntaxType");
describe("Parser", () => {
    describe("Binary operator test", () => {
        (() => {
            const parser = new Parser_1.Parser("true & false;");
            const statements = parser.Parse();
            const binaryExprStatement = statements[0];
            const binaryExpression = binaryExprStatement.Expression;
            it("should produce a logical expression", () => {
                chai_1.expect(binaryExpression).to.not.be.an("undefined");
                chai_1.expect(binaryExpression).to.have.property("Left");
                chai_1.expect(binaryExpression).to.have.property("Right");
                chai_1.expect(binaryExpression).to.have.property("Operator");
            });
            it("should have the left evaluate to true and right to false", () => {
                chai_1.expect(binaryExpression.Left).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Right).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Left).to.have.property("Value");
                chai_1.expect(binaryExpression.Right).to.have.property("Value");
                chai_1.expect(binaryExpression.Left.Value).to.equal(true);
                chai_1.expect(binaryExpression.Right.Value).to.equal(false);
            });
            it("should have a & operator token", () => {
                chai_1.expect(binaryExpression.Operator).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Operator).to.have.property("Type");
                chai_1.expect(binaryExpression.Operator).to.have.property("Lexeme");
                chai_1.expect(binaryExpression.Operator).to.have.property("Line");
                chai_1.expect(binaryExpression.Operator).to.have.property("Literal");
                chai_1.expect(binaryExpression.Operator.Type).to.equal(SyntaxType_1.SyntaxType.AND);
            });
        })();
        (() => {
            const parser = new Parser_1.Parser("false | true;");
            const statements = parser.Parse();
            const binaryExprStatement = statements[0];
            const binaryExpression = binaryExprStatement.Expression;
            it("should produce a logical expression", () => {
                chai_1.expect(binaryExpression).to.not.be.an("undefined");
                chai_1.expect(binaryExpression).to.have.property("Left");
                chai_1.expect(binaryExpression).to.have.property("Right");
                chai_1.expect(binaryExpression).to.have.property("Operator");
            });
            it("should have the left evaluate to false and right to true", () => {
                chai_1.expect(binaryExpression.Left).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Right).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Left).to.have.property("Value");
                chai_1.expect(binaryExpression.Right).to.have.property("Value");
                chai_1.expect(binaryExpression.Left.Value).to.equal(false);
                chai_1.expect(binaryExpression.Right.Value).to.equal(true);
            });
            it("should have a | operator token", () => {
                chai_1.expect(binaryExpression.Operator).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Operator).to.have.property("Type");
                chai_1.expect(binaryExpression.Operator).to.have.property("Lexeme");
                chai_1.expect(binaryExpression.Operator).to.have.property("Line");
                chai_1.expect(binaryExpression.Operator).to.have.property("Literal");
                chai_1.expect(binaryExpression.Operator.Type).to.equal(SyntaxType_1.SyntaxType.OR);
            });
        })();
        (() => {
            const parser = new Parser_1.Parser("2 + 4;");
            const statements = parser.Parse();
            const binaryExprStatement = statements[0];
            const binaryExpression = binaryExprStatement.Expression;
            it("should produce a binary expression", () => {
                chai_1.expect(binaryExpression).to.not.be.an("undefined");
                chai_1.expect(binaryExpression).to.have.property("Left");
                chai_1.expect(binaryExpression).to.have.property("Right");
                chai_1.expect(binaryExpression).to.have.property("Operator");
            });
            it("should have the left evaluate to 2 and right to 4", () => {
                chai_1.expect(binaryExpression.Left).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Right).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Left).to.have.property("Value");
                chai_1.expect(binaryExpression.Right).to.have.property("Value");
                chai_1.expect(binaryExpression.Left.Value).to.equal(2);
                chai_1.expect(binaryExpression.Right.Value).to.equal(4);
            });
            it("should have a + operator token", () => {
                chai_1.expect(binaryExpression.Operator).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Operator).to.have.property("Type");
                chai_1.expect(binaryExpression.Operator).to.have.property("Lexeme");
                chai_1.expect(binaryExpression.Operator).to.have.property("Line");
                chai_1.expect(binaryExpression.Operator).to.have.property("Literal");
                chai_1.expect(binaryExpression.Operator.Type).to.equal(SyntaxType_1.SyntaxType.PLUS);
            });
        })();
        (() => {
            const parser = new Parser_1.Parser("6 - 3 * 2;");
            const statements = parser.Parse();
            const binaryExprStatement = statements[0];
            const binaryExpression = binaryExprStatement.Expression;
            it("should produce a binary expression", () => {
                chai_1.expect(binaryExpression).to.not.be.an("undefined");
                chai_1.expect(binaryExpression).to.have.property("Left");
                chai_1.expect(binaryExpression).to.have.property("Right");
                chai_1.expect(binaryExpression).to.have.property("Operator");
            });
            it("should have the left evaluate to 6 and right to binary(3 * 2)", () => {
                chai_1.expect(binaryExpression.Left).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Right).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Left).to.have.property("Value");
                chai_1.expect(binaryExpression.Right).to.have.property("Left");
                chai_1.expect(binaryExpression.Right).to.have.property("Right");
                chai_1.expect(binaryExpression.Right).to.have.property("Operator");
                chai_1.expect(binaryExpression.Left.Value).to.equal(6);
                chai_1.expect(binaryExpression.Right.Left.Value).to.equal(3);
                chai_1.expect(binaryExpression.Right.Right.Value).to.equal(2);
                chai_1.expect(binaryExpression.Right.Operator).to.have.property("Type");
                chai_1.expect(binaryExpression.Right.Operator).to.have.property("Lexeme");
                chai_1.expect(binaryExpression.Right.Operator).to.have.property("Line");
                chai_1.expect(binaryExpression.Right.Operator).to.have.property("Literal");
                chai_1.expect(binaryExpression.Right.Operator.Type).to.equal(SyntaxType_1.SyntaxType.STAR);
            });
            it("should have a - operator token", () => {
                chai_1.expect(binaryExpression.Operator).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Operator).to.have.property("Type");
                chai_1.expect(binaryExpression.Operator).to.have.property("Lexeme");
                chai_1.expect(binaryExpression.Operator).to.have.property("Line");
                chai_1.expect(binaryExpression.Operator).to.have.property("Literal");
                chai_1.expect(binaryExpression.Operator.Type).to.equal(SyntaxType_1.SyntaxType.MINUS);
            });
        })();
        (() => {
            const parser = new Parser_1.Parser("4 % 2 ^ 2;");
            const statements = parser.Parse();
            const binaryExprStatement = statements[0];
            const binaryExpression = binaryExprStatement.Expression;
            it("should produce a binary expression", () => {
                chai_1.expect(binaryExpression).to.not.be.an("undefined");
                chai_1.expect(binaryExpression).to.have.property("Left");
                chai_1.expect(binaryExpression).to.have.property("Right");
                chai_1.expect(binaryExpression).to.have.property("Operator");
            });
            it("should have the left evaluate to 4 and right to binary(2 ^ 2)", () => {
                chai_1.expect(binaryExpression.Left).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Right).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Left).to.have.property("Value");
                chai_1.expect(binaryExpression.Right).to.have.property("Left");
                chai_1.expect(binaryExpression.Right).to.have.property("Right");
                chai_1.expect(binaryExpression.Right).to.have.property("Operator");
                chai_1.expect(binaryExpression.Left.Value).to.equal(4);
                chai_1.expect(binaryExpression.Right.Left.Value).to.equal(2);
                chai_1.expect(binaryExpression.Right.Right.Value).to.equal(2);
                chai_1.expect(binaryExpression.Right.Operator).to.have.property("Type");
                chai_1.expect(binaryExpression.Right.Operator).to.have.property("Lexeme");
                chai_1.expect(binaryExpression.Right.Operator).to.have.property("Line");
                chai_1.expect(binaryExpression.Right.Operator).to.have.property("Literal");
                chai_1.expect(binaryExpression.Right.Operator.Type).to.equal(SyntaxType_1.SyntaxType.CARAT);
            });
            it("should have a % operator token", () => {
                chai_1.expect(binaryExpression.Operator).to.not.be.an("undefined");
                chai_1.expect(binaryExpression.Operator).to.have.property("Type");
                chai_1.expect(binaryExpression.Operator).to.have.property("Lexeme");
                chai_1.expect(binaryExpression.Operator).to.have.property("Line");
                chai_1.expect(binaryExpression.Operator).to.have.property("Literal");
                chai_1.expect(binaryExpression.Operator.Type).to.equal(SyntaxType_1.SyntaxType.PERCENT);
            });
        })();
    });
    describe("Unary operator test", () => {
        (() => {
            const parser = new Parser_1.Parser("!true;");
            const statements = parser.Parse();
            const unaryExprStatement = statements[0];
            const unaryExpression = unaryExprStatement.Expression;
            it("should produce a unary expression", () => {
                chai_1.expect(unaryExpression).to.not.be.an("undefined");
                chai_1.expect(unaryExpression).to.have.property("Right");
                chai_1.expect(unaryExpression).to.have.property("Operator");
            });
            it("should have the operand evaluate to true", () => {
                chai_1.expect(unaryExpression.Right).to.not.be.an("undefined");
                chai_1.expect(unaryExpression.Right).to.have.property("Value");
                chai_1.expect(unaryExpression.Right.Value).to.equal(true);
            });
            it("should have a ! operator token", () => {
                chai_1.expect(unaryExpression.Operator).to.not.be.an("undefined");
                chai_1.expect(unaryExpression.Operator).to.have.property("Type");
                chai_1.expect(unaryExpression.Operator).to.have.property("Lexeme");
                chai_1.expect(unaryExpression.Operator).to.have.property("Line");
                chai_1.expect(unaryExpression.Operator).to.have.property("Literal");
                chai_1.expect(unaryExpression.Operator.Type).to.equal(SyntaxType_1.SyntaxType.BANG);
            });
        })();
        (() => {
            const parser = new Parser_1.Parser("-42;");
            const statements = parser.Parse();
            const unaryExprStatement = statements[0];
            const unaryExpression = unaryExprStatement.Expression;
            it("should produce a unary expression", () => {
                chai_1.expect(unaryExpression).to.not.be.an("undefined");
                chai_1.expect(unaryExpression).to.have.property("Right");
                chai_1.expect(unaryExpression).to.have.property("Operator");
            });
            it("should have the operand evaluate to 42", () => {
                chai_1.expect(unaryExpression.Right).to.not.be.an("undefined");
                chai_1.expect(unaryExpression.Right).to.have.property("Value");
                chai_1.expect(unaryExpression.Right.Value).to.equal(42);
            });
            it("should have a - operator token", () => {
                chai_1.expect(unaryExpression.Operator).to.not.be.an("undefined");
                chai_1.expect(unaryExpression.Operator).to.have.property("Type");
                chai_1.expect(unaryExpression.Operator).to.have.property("Lexeme");
                chai_1.expect(unaryExpression.Operator).to.have.property("Line");
                chai_1.expect(unaryExpression.Operator).to.have.property("Literal");
                chai_1.expect(unaryExpression.Operator.Type).to.equal(SyntaxType_1.SyntaxType.MINUS);
            });
        })();
        (() => {
            const parser = new Parser_1.Parser("+76;");
            const statements = parser.Parse();
            const unaryExprStatement = statements[0];
            const unaryExpression = unaryExprStatement.Expression;
            it("should produce a unary expression", () => {
                chai_1.expect(unaryExpression).to.not.be.an("undefined");
                chai_1.expect(unaryExpression).to.have.property("Right");
                chai_1.expect(unaryExpression).to.have.property("Operator");
            });
            it("should have the operand evaluate to 76", () => {
                chai_1.expect(unaryExpression.Right).to.not.be.an("undefined");
                chai_1.expect(unaryExpression.Right).to.have.property("Value");
                chai_1.expect(unaryExpression.Right.Value).to.equal(76);
            });
            it("should have a + operator token", () => {
                chai_1.expect(unaryExpression.Operator).to.not.be.an("undefined");
                chai_1.expect(unaryExpression.Operator).to.have.property("Type");
                chai_1.expect(unaryExpression.Operator).to.have.property("Lexeme");
                chai_1.expect(unaryExpression.Operator).to.have.property("Line");
                chai_1.expect(unaryExpression.Operator).to.have.property("Literal");
                chai_1.expect(unaryExpression.Operator.Type).to.equal(SyntaxType_1.SyntaxType.PLUS);
            });
        })();
    });
    describe("Error reporting test", () => {
        (() => {
            const parser = new Parser_1.Parser("print 5"); // Missing semicolon
            it("should raise an expected ';' error", () => chai_1.expect(parser.Parse).to.throw());
        })();
        (() => {
            const parser = new Parser_1.Parser("raise 'Raised error';");
            it("should raise a 'Raised error' error", () => chai_1.expect(parser.Parse).to.throw());
        })();
        (() => {
            const parser = new Parser_1.Parser("if (true)");
            it("should raise an expected '{' error", () => chai_1.expect(parser.Parse).to.throw());
        })();
        (() => {
            const parser = new Parser_1.Parser("-false;");
            it("should raise a runtime error", () => chai_1.expect(parser.Parse).to.throw());
        })();
        (() => {
            const parser = new Parser_1.Parser("return;");
            it("should raise a runtime error", () => chai_1.expect(parser.Parse).to.throw());
        })();
        (() => {
            const parser = new Parser_1.Parser("method hello(name) { print 'hello ' + name ");
            it("should raise an expected '}' error", () => chai_1.expect(parser.Parse).to.throw());
        })();
        (() => {
            const parser = new Parser_1.Parser("for (let i; i < 2) {}");
            it("should raise an expected ';' error", () => chai_1.expect(parser.Parse).to.throw());
        })();
    });
});
