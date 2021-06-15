import { describe } from "mocha";
import { expect } from "chai";
import { Lexer } from "../CodeAnalysis/Syntax/Lexer";
import { Token } from "../CodeAnalysis/Syntax/Token";
import { SyntaxType } from "../CodeAnalysis/Syntax/SyntaxType";

describe("Lexer", () => {
    describe("Add and subtract test", () => {
        const lexer = new Lexer("4 + 7 - 3");
        const tokens: Token[] = lexer.LexTokens();
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
    describe("Multipy, divide, and decimal test", () => {
        const lexer = new Lexer("2.5 * 6 / 3");
        const tokens: Token[] = lexer.LexTokens();
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
    describe("Parenthesis, power, and modulo test", () => {
        const lexer = new Lexer("4 ^ 2 % (9 / 3)");
        const tokens: Token[] = lexer.LexTokens();
        it("should produce 9 tokens", () => 
            expect(
                tokens.length - 1
            ).to.equal(9)
        );
    });
    describe("And, or, and all of the equals test", () => {
        const lexer = new Lexer("(false | true) & false == false & true | (false != true)");
        const tokens: Token[] = lexer.LexTokens();
        it("should produce 17 tokens", () => 
            expect(
                tokens.length - 1
            ).to.equal(17)
        );
    });
    describe("Unary operator test", () => {
        const lexer = new Lexer("!false;");
        const tokens: Token[] = lexer.LexTokens();
        const 
            first = tokens[0], 
            second = tokens[1], 
            third = tokens[2];

        it("should produce 3 tokens", () => 
            expect(
                tokens.length - 1
            ).to.equal(3)
        );
        it("should have bang and false tokens", () => {
            expect(first.Type).to.equal(SyntaxType.BANG);
            expect(second.Type).to.equal(SyntaxType.FALSE);
            expect(third.Type).to.equal(SyntaxType.SEMICOLON);
        });
    });
    describe("Literal test", () => {
        const lexer = new Lexer("3.14159265359;");
        const tokens: Token[] = lexer.LexTokens();
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
    describe("Print test", () => {
        const lexer = new Lexer('print 8;');
        const tokens: Token[] = lexer.LexTokens();
        
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
    describe("Comment test", () => {
        const lexer = new Lexer("## This is a comment.");
        const tokens: Token[] = lexer.LexTokens();
        it("should produce 0 tokens", () =>
            expect(
                tokens.length - 1
            ).to.equal(0)
        );
    });
});