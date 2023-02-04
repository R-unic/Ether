import { describe } from "mocha";
import { expect } from "chai";
import { Lexer } from "../CodeAnalysis/Syntax/Lexer";
import { Token } from "../CodeAnalysis/Syntax/Token";
import { SyntaxType } from "../CodeAnalysis/Syntax/SyntaxType";

describe("Lexer#Tokenize", () => {
    describe("Compound assignment", () => {
        const lexer = new Lexer("a += 1;");
        const tokens: Token[] = lexer.Tokenize();
        const
            first = tokens[0],
            second = tokens[1],
            third = tokens[2],
            fourth = tokens[3];

        it("should produce 4 tokens", () =>
            expect(tokens.length - 1).to.equal(4)
        );
        it("should have identifier, plus equals, number, and semicolon tokens", () => {
            expect(first.Type).to.equal(SyntaxType.IDENTIFIER);
            expect(second.Type).to.equal(SyntaxType.PLUS_EQUAL);
            expect(third.Type).to.equal(SyntaxType.NUMBER);
            expect(fourth.Type).to.equal(SyntaxType.SEMICOLON);
        });
        it("should have null, null, 1, and null literals in that order", () => {
            expect(first.Literal).to.equal(null);
            expect(second.Literal).to.equal(null);
            expect(third.Literal).to.equal(1);
            expect(fourth.Literal).to.equal(null);
        });
        it("should produce proper lexemes", () => {
            expect(first.Lexeme).to.equal("a");
            expect(second.Lexeme).to.equal("+=");
            expect(third.Lexeme).to.equal("1");
            expect(fourth.Lexeme).to.equal(";");
        });
    });
    describe("Addition and subtraction", () => {
        const lexer = new Lexer("4 + 7 - 3");
        const tokens: Token[] = lexer.Tokenize();
        const
            first = tokens[0],
            second = tokens[1],
            third = tokens[2],
            fourth = tokens[3],
            fifth = tokens[4];

        it("should produce 5 tokens", () =>
            expect(
                tokens.length - 1
            ).to.equal(5)
        );
        it("should have number, plus, number, minus, and number tokens in that order", () => {
            expect(first.Type).to.equal(SyntaxType.NUMBER);
            expect(second.Type).to.equal(SyntaxType.PLUS);
            expect(third.Type).to.equal(SyntaxType.NUMBER);
            expect(fourth.Type).to.equal(SyntaxType.MINUS);
            expect(fifth.Type).to.equal(SyntaxType.NUMBER);
        });
        it("should have 4, null, 7, null, and 3 literals in that order", () => {
            expect(first.Literal).to.equal(4);
            expect(second.Literal).to.equal(null);
            expect(third.Literal).to.equal(7);
            expect(fourth.Literal).to.equal(null);
            expect(fifth.Literal).to.equal(3);
        });
    });
    describe("Multiplication, division, and decimals", () => {
        const lexer = new Lexer("2.5 * 6 / 3");
        const tokens: Token[] = lexer.Tokenize();
        const
            first = tokens[0],
            second = tokens[1],
            third = tokens[2],
            fourth = tokens[3],
            fifth = tokens[4];

        it("should produce 5 tokens", () =>
            expect(tokens.length - 1).to.equal(5)
        );
        it("should have number, star, number, slash, and number tokens in that order", () => {
            expect(first.Type).to.equal(SyntaxType.NUMBER);
            expect(second.Type).to.equal(SyntaxType.STAR);
            expect(third.Type).to.equal(SyntaxType.NUMBER);
            expect(fourth.Type).to.equal(SyntaxType.SLASH);
            expect(fifth.Type).to.equal(SyntaxType.NUMBER);
        });
        it("should have 2.5, null, 6, null, and 3 literals in that order", () => {
            expect(first.Literal).to.equal(2.5);
            expect(second.Literal).to.equal(null);
            expect(third.Literal).to.equal(6);
            expect(fourth.Literal).to.equal(null);
            expect(fifth.Literal).to.equal(3);
        });
    });
    describe("Parentheses, exponentation, and modulus", () => {
        const lexer = new Lexer("4 ^ 2 % (9 / 3)");
        const tokens: Token[] = lexer.Tokenize();
        it("should produce 9 tokens", () =>
            expect(tokens.length - 1).to.equal(9)
        );
    });
    describe("Comparison", () => {
        const lexer = new Lexer("(false | true) & false == false & true | (false != true)");
        const tokens: Token[] = lexer.Tokenize();
        it("should produce 17 tokens", () =>
            expect(tokens.length - 1).to.equal(17)
        );
    });
    describe("Unary operators", () => {
        const lexer = new Lexer("!false;");
        const tokens: Token[] = lexer.Tokenize();
        const
            first = tokens[0],
            second = tokens[1],
            third = tokens[2];

        it("should produce 3 tokens", () =>
            expect(tokens.length - 1).to.equal(3)
        );
        it("should have bang and false tokens", () => {
            expect(first.Type).to.equal(SyntaxType.BANG);
            expect(second.Type).to.equal(SyntaxType.FALSE);
            expect(third.Type).to.equal(SyntaxType.SEMICOLON);
        });
        it("should produce null, false, and null literals in that order", () => {
            expect(first.Literal).to.equal(null);
            expect(second.Literal).to.equal(null);
            expect(third.Literal).to.equal(null);
        });
    });
    describe("Number literals", () => {
        const lexer = new Lexer("3.14159265359;");
        const tokens: Token[] = lexer.Tokenize();
        const first = tokens[0], second = tokens[1];
        it("should produce 2 tokens", () =>
            expect(
                tokens.length - 1
            ).to.equal(2)
        );
        it("should have a number token", () => {
            expect(first.Type).to.equal(SyntaxType.NUMBER);
            expect(second.Type).to.equal(SyntaxType.SEMICOLON);
        });
        it("should have a 3.14159265359 literal", () =>
            expect(first.Literal).to.equal(3.14159265359)
        );
    });
    describe("Print", () => {
        const lexer = new Lexer('print 8;');
        const tokens: Token[] = lexer.Tokenize();

        const
            first = tokens[0],
            second = tokens[1],
            third = tokens[2];

        it("should produce 3 tokens", () =>
            expect(
                tokens.length - 1
            ).to.equal(3)
        );
        it("should have print and string tokens", () => {
            expect(first.Type).to.equal(SyntaxType.PRINT);
            expect(second.Type).to.equal(SyntaxType.NUMBER);
            expect(third.Type).to.equal(SyntaxType.SEMICOLON);
        });
        it("should produce proper lexemes", () => {
            expect(first.Lexeme).to.equal("print");
            expect(second.Lexeme).to.equal("8");
            expect(third.Lexeme).to.equal(";");
        });
        it("should produce proper literals", () => {
            expect(first.Literal).to.equal(null);
            expect(second.Literal).to.equal(8);
            expect(third.Literal).to.equal(null);
        });
    });
    describe("Global assignment", () => {
        const lexer = new Lexer("global var = 8;");
        const tokens: Token[] = lexer.Tokenize();

        const
            first = tokens[0],
            second = tokens[1],
            third = tokens[2],
            fourth = tokens[3],
            fifth = tokens[4];

        it("should produce 5 tokens", () =>
            expect(tokens.length - 1).to.equal(5)
        );
        it("should have global, identifier, equals, number, and semicolon tokens", () => {
            expect(first.Type).to.equal(SyntaxType.GLOBAL);
            expect(second.Type).to.equal(SyntaxType.IDENTIFIER);
            expect(third.Type).to.equal(SyntaxType.EQUAL);
            expect(fourth.Type).to.equal(SyntaxType.NUMBER);
            expect(fifth.Type).to.equal(SyntaxType.SEMICOLON);
        });
        it("should produce proper lexemes", () => {
            expect(first.Lexeme).to.equal("global");
            expect(second.Lexeme).to.equal("var");
            expect(third.Lexeme).to.equal("=");
            expect(fourth.Lexeme).to.equal("8");
            expect(fifth.Lexeme).to.equal(";");
        });
        it("should produce proper literals", () => {
            expect(first.Literal).to.equal(null);
            expect(second.Literal).to.equal(null);
            expect(third.Literal).to.equal(null);
            expect(fourth.Literal).to.equal(8);
            expect(fifth.Literal).to.equal(null);
        });
    });
    describe("Local assignment", () => {
        const lexer = new Lexer("let value = 'hello';");
        const tokens: Token[] = lexer.Tokenize();

        const
            first = tokens[0],
            second = tokens[1],
            third = tokens[2],
            fourth = tokens[3],
            fifth = tokens[4];

        it("should produce 5 tokens", () =>
            expect(tokens.length - 1).to.equal(5)
        );
        it("should have let, identifier, equals, string, and semicolon tokens", () => {
            expect(first.Type).to.equal(SyntaxType.GLOBAL);
            expect(second.Type).to.equal(SyntaxType.IDENTIFIER);
            expect(third.Type).to.equal(SyntaxType.EQUAL);
            expect(fourth.Type).to.equal(SyntaxType.STRING);
            expect(fifth.Type).to.equal(SyntaxType.SEMICOLON);
        });
        it("should produce proper lexemes", () => {
            expect(first.Lexeme).to.equal("let");
            expect(second.Lexeme).to.equal("value");
            expect(third.Lexeme).to.equal("=");
            expect(fourth.Lexeme).to.equal("'hello'");
            expect(fifth.Lexeme).to.equal(";");
        });
        it("should produce proper literals", () => {
            expect(first.Literal).to.equal(null);
            expect(second.Literal).to.equal(null);
            expect(third.Literal).to.equal(null);
            expect(fourth.Literal).to.equal("hello");
            expect(fifth.Literal).to.equal(null);
        });
    })
    describe("Comment test", () => {
        const lexer = new Lexer("## This is a comment. ##: this is a multiline comment :##");
        const tokens: Token[] = lexer.Tokenize();
        it("should produce 0 tokens", () =>
            expect(tokens.length - 1).to.equal(0)
        );
    });
    describe("Error reporting test", () => {
        const lexer = new Lexer("$@\\");
        it("should raise an unexpected character error", () =>
            expect(lexer.Tokenize).to.throw()
        );
    });
});
