"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const Lexer_1 = require("../../CodeAnalysis/Syntax/Lexer");
const SyntaxType_1 = require("../../CodeAnalysis/Syntax/SyntaxType");
mocha_1.describe("Lexer lexes tokens", () => {
    mocha_1.describe("Add and subtract", () => {
        const lexer = new Lexer_1.Lexer("4 + 7 - 3");
        const tokens = lexer.ScanTokens();
        const first = tokens[0], second = tokens[1], third = tokens[2], fourth = tokens[3], fifth = tokens[4];
        it("should produce 5 tokens", () => chai_1.expect(tokens.length - 1).to.equal(5));
        it("should have number, plus, number, minus, and number tokens in that order", () => {
            chai_1.expect(first.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            chai_1.expect(second.Type).to.equal(SyntaxType_1.SyntaxType.PLUS);
            chai_1.expect(third.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            chai_1.expect(fourth.Type).to.equal(SyntaxType_1.SyntaxType.MINUS);
            chai_1.expect(fifth.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
        });
        it("should have 4, null, 7, null, and 3 literals in that order", () => {
            chai_1.expect(first.Literal).to.equal(4);
            chai_1.expect(second.Literal).to.equal(null);
            chai_1.expect(third.Literal).to.equal(7);
            chai_1.expect(fourth.Literal).to.equal(null);
            chai_1.expect(fifth.Literal).to.equal(3);
        });
    });
    mocha_1.describe("Multipy, divide, and decimals", () => {
        const lexer = new Lexer_1.Lexer("2.5 * 6 / 3");
        const tokens = lexer.ScanTokens();
        const first = tokens[0], second = tokens[1], third = tokens[2], fourth = tokens[3], fifth = tokens[4];
        it("should produce 5 tokens", () => chai_1.expect(tokens.length - 1).to.equal(5));
        it("should have number, star, number, slash, and number tokens in that order", () => {
            chai_1.expect(first.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            chai_1.expect(second.Type).to.equal(SyntaxType_1.SyntaxType.STAR);
            chai_1.expect(third.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            chai_1.expect(fourth.Type).to.equal(SyntaxType_1.SyntaxType.SLASH);
            chai_1.expect(fifth.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
        });
        it("should have 2.5, null, 6, null, and 3 literals in that order", () => {
            chai_1.expect(first.Literal).to.equal(2.5);
            chai_1.expect(second.Literal).to.equal(null);
            chai_1.expect(third.Literal).to.equal(6);
            chai_1.expect(fourth.Literal).to.equal(null);
            chai_1.expect(fifth.Literal).to.equal(3);
        });
    });
    mocha_1.describe("Parenthesis, power, and modulo", () => {
        const lexer = new Lexer_1.Lexer("4 ^ 2 % (9 / 3)");
        const tokens = lexer.ScanTokens();
        it("should produce 9 tokens", () => chai_1.expect(tokens.length - 1).to.equal(9));
    });
    mocha_1.describe("And, or, and all of the equals", () => {
        const lexer = new Lexer_1.Lexer("(false | true) & false == false & true | (false != true)");
        const tokens = lexer.ScanTokens();
        it("should produce 17 tokens", () => chai_1.expect(tokens.length - 1).to.equal(17));
    });
    mocha_1.describe("Unary operators", () => {
        const lexer = new Lexer_1.Lexer("!false");
        const tokens = lexer.ScanTokens();
        const first = tokens[0], second = tokens[1];
        it("should produce 2 tokens", () => chai_1.expect(tokens.length - 1).to.equal(2));
        it("should have bang and false tokens", () => {
            chai_1.expect(first.Type).to.equal(SyntaxType_1.SyntaxType.BANG);
            chai_1.expect(second.Type).to.equal(SyntaxType_1.SyntaxType.FALSE);
        });
    });
    mocha_1.describe("Literals", () => {
        const lexer = new Lexer_1.Lexer("3.14159265359");
        const tokens = lexer.ScanTokens();
        const first = tokens[0];
        it("should produce 1 token", () => chai_1.expect(tokens.length - 1).to.equal(1));
        it("should have a number token", () => chai_1.expect(first.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER));
        it("should have a 3.14159265359 literal", () => chai_1.expect(first.Literal).to.equal(3.14159265359));
    });
});
