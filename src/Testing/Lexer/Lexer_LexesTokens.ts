import { describe } from "mocha";
import { expect } from "chai";
import { Lexer } from "../../CodeAnalysis/Syntax/Lexer";
import { Token } from "../../CodeAnalysis/Syntax/Token";
import { SyntaxType } from "../../CodeAnalysis/Syntax/SyntaxType";

describe("Lexer lexes tokens", () => {
    describe("Add and subtract", () => {
        const lexer = new Lexer("4 + 7 - 3");
        const tokens: Token[] = lexer.ScanTokens();
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
    describe("Multipy, divide, and decimals", () => {
        const lexer = new Lexer("2.5 * 6 / 3");
        const tokens: Token[] = lexer.ScanTokens();
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
    describe("Parenthesis, power, and modulo", () => {
        const lexer = new Lexer("4 ^ 2 % (9 / 3)");
        const tokens: Token[] = lexer.ScanTokens();
        it("should produce 9 tokens", () => 
            expect(
                tokens.length - 1
            ).to.equal(9)
        );
    });
    describe("And, or, and all of the equals", () => {
        const lexer = new Lexer("(false | true) & false == false & true | (false != true)");
        const tokens: Token[] = lexer.ScanTokens();
        it("should produce 17 tokens", () => 
            expect(
                tokens.length - 1
            ).to.equal(17)
        );
    });
    describe("Unary operators", () => {
        const lexer = new Lexer("!false");
        const tokens: Token[] = lexer.ScanTokens();
        const first = tokens[0], second = tokens[1];
        it("should produce 2 tokens", () => 
            expect(
                tokens.length - 1
            ).to.equal(2)
        );
        it("should have bang and false tokens", () => {
            expect(first.Type).to.equal(SyntaxType.BANG);
            expect(second.Type).to.equal(SyntaxType.FALSE);
        });
    });
    describe("Literals", () => {
        const lexer = new Lexer("3.14159265359");
        const tokens: Token[] = lexer.ScanTokens();
        const first = tokens[0];
        it("should produce 1 token", () => 
            expect(
                tokens.length - 1
            ).to.equal(1)
        );
        it("should have a number token", () =>
            expect(first.Type).to.equal(SyntaxType.NUMBER)
        );
        it("should have a 3.14159265359 literal", () =>
            expect(first.Literal).to.equal(3.14159265359)
        );
    })
});