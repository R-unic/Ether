"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const Lexer_1 = require("../CodeAnalysis/Syntax/Lexer");
const SyntaxType_1 = require("../CodeAnalysis/Syntax/SyntaxType");
(0, mocha_1.describe)("Lexer#Tokenize", () => {
    (0, mocha_1.describe)("Compound assignment", () => {
        const lexer = new Lexer_1.Lexer("a += 1;");
        const tokens = lexer.Tokenize();
        const first = tokens[0], second = tokens[1], third = tokens[2], fourth = tokens[3];
        it("should produce 4 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(4));
        it("should have identifier, plus equals, number, and semicolon tokens", () => {
            (0, chai_1.expect)(first.Type).to.equal(SyntaxType_1.SyntaxType.IDENTIFIER);
            (0, chai_1.expect)(second.Type).to.equal(SyntaxType_1.SyntaxType.PLUS_EQUAL);
            (0, chai_1.expect)(third.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            (0, chai_1.expect)(fourth.Type).to.equal(SyntaxType_1.SyntaxType.SEMICOLON);
        });
        it("should have null, null, 1, and null literals in that order", () => {
            (0, chai_1.expect)(first.Literal).to.equal(null);
            (0, chai_1.expect)(second.Literal).to.equal(null);
            (0, chai_1.expect)(third.Literal).to.equal(1);
            (0, chai_1.expect)(fourth.Literal).to.equal(null);
        });
        it("should produce proper lexemes", () => {
            (0, chai_1.expect)(first.Lexeme).to.equal("a");
            (0, chai_1.expect)(second.Lexeme).to.equal("+=");
            (0, chai_1.expect)(third.Lexeme).to.equal("1");
            (0, chai_1.expect)(fourth.Lexeme).to.equal(";");
        });
    });
    (0, mocha_1.describe)("Addition and subtraction", () => {
        const lexer = new Lexer_1.Lexer("4 + 7 - 3");
        const tokens = lexer.Tokenize();
        const first = tokens[0], second = tokens[1], third = tokens[2], fourth = tokens[3], fifth = tokens[4];
        it("should produce 5 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(5));
        it("should have number, plus, number, minus, and number tokens in that order", () => {
            (0, chai_1.expect)(first.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            (0, chai_1.expect)(second.Type).to.equal(SyntaxType_1.SyntaxType.PLUS);
            (0, chai_1.expect)(third.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            (0, chai_1.expect)(fourth.Type).to.equal(SyntaxType_1.SyntaxType.MINUS);
            (0, chai_1.expect)(fifth.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
        });
        it("should have 4, null, 7, null, and 3 literals in that order", () => {
            (0, chai_1.expect)(first.Literal).to.equal(4);
            (0, chai_1.expect)(second.Literal).to.equal(null);
            (0, chai_1.expect)(third.Literal).to.equal(7);
            (0, chai_1.expect)(fourth.Literal).to.equal(null);
            (0, chai_1.expect)(fifth.Literal).to.equal(3);
        });
    });
    (0, mocha_1.describe)("Multiplication, division, and decimals", () => {
        const lexer = new Lexer_1.Lexer("2.5 * 6 / 3");
        const tokens = lexer.Tokenize();
        const first = tokens[0], second = tokens[1], third = tokens[2], fourth = tokens[3], fifth = tokens[4];
        it("should produce 5 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(5));
        it("should have number, star, number, slash, and number tokens in that order", () => {
            (0, chai_1.expect)(first.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            (0, chai_1.expect)(second.Type).to.equal(SyntaxType_1.SyntaxType.STAR);
            (0, chai_1.expect)(third.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            (0, chai_1.expect)(fourth.Type).to.equal(SyntaxType_1.SyntaxType.SLASH);
            (0, chai_1.expect)(fifth.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
        });
        it("should have 2.5, null, 6, null, and 3 literals in that order", () => {
            (0, chai_1.expect)(first.Literal).to.equal(2.5);
            (0, chai_1.expect)(second.Literal).to.equal(null);
            (0, chai_1.expect)(third.Literal).to.equal(6);
            (0, chai_1.expect)(fourth.Literal).to.equal(null);
            (0, chai_1.expect)(fifth.Literal).to.equal(3);
        });
    });
    (0, mocha_1.describe)("Parentheses, exponentation, and modulus", () => {
        const lexer = new Lexer_1.Lexer("4 ^ 2 % (9 / 3)");
        const tokens = lexer.Tokenize();
        it("should produce 9 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(9));
    });
    (0, mocha_1.describe)("Comparison", () => {
        const lexer = new Lexer_1.Lexer("(false | true) & false == false & true | (false != true)");
        const tokens = lexer.Tokenize();
        it("should produce 17 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(17));
    });
    (0, mocha_1.describe)("Unary operators", () => {
        const lexer = new Lexer_1.Lexer("!false;");
        const tokens = lexer.Tokenize();
        const first = tokens[0], second = tokens[1], third = tokens[2];
        it("should produce 3 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(3));
        it("should have bang and false tokens", () => {
            (0, chai_1.expect)(first.Type).to.equal(SyntaxType_1.SyntaxType.BANG);
            (0, chai_1.expect)(second.Type).to.equal(SyntaxType_1.SyntaxType.FALSE);
            (0, chai_1.expect)(third.Type).to.equal(SyntaxType_1.SyntaxType.SEMICOLON);
        });
        it("should produce null, false, and null literals in that order", () => {
            (0, chai_1.expect)(first.Literal).to.equal(null);
            (0, chai_1.expect)(second.Literal).to.equal(null);
            (0, chai_1.expect)(third.Literal).to.equal(null);
        });
    });
    (0, mocha_1.describe)("Number literals", () => {
        const lexer = new Lexer_1.Lexer("3.14159265359;");
        const tokens = lexer.Tokenize();
        const first = tokens[0], second = tokens[1];
        it("should produce 2 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(2));
        it("should have a number token", () => {
            (0, chai_1.expect)(first.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            (0, chai_1.expect)(second.Type).to.equal(SyntaxType_1.SyntaxType.SEMICOLON);
        });
        it("should have a 3.14159265359 literal", () => (0, chai_1.expect)(first.Literal).to.equal(3.14159265359));
    });
    (0, mocha_1.describe)("Print", () => {
        const lexer = new Lexer_1.Lexer('print 8;');
        const tokens = lexer.Tokenize();
        const first = tokens[0], second = tokens[1], third = tokens[2];
        it("should produce 3 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(3));
        it("should have print and string tokens", () => {
            (0, chai_1.expect)(first.Type).to.equal(SyntaxType_1.SyntaxType.PRINT);
            (0, chai_1.expect)(second.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            (0, chai_1.expect)(third.Type).to.equal(SyntaxType_1.SyntaxType.SEMICOLON);
        });
        it("should produce proper lexemes", () => {
            (0, chai_1.expect)(first.Lexeme).to.equal("print");
            (0, chai_1.expect)(second.Lexeme).to.equal("8");
            (0, chai_1.expect)(third.Lexeme).to.equal(";");
        });
        it("should produce proper literals", () => {
            (0, chai_1.expect)(first.Literal).to.equal(null);
            (0, chai_1.expect)(second.Literal).to.equal(8);
            (0, chai_1.expect)(third.Literal).to.equal(null);
        });
    });
    (0, mocha_1.describe)("Global assignment", () => {
        const lexer = new Lexer_1.Lexer("global var = 8;");
        const tokens = lexer.Tokenize();
        const first = tokens[0], second = tokens[1], third = tokens[2], fourth = tokens[3], fifth = tokens[4];
        it("should produce 5 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(5));
        it("should have global, identifier, equals, number, and semicolon tokens", () => {
            (0, chai_1.expect)(first.Type).to.equal(SyntaxType_1.SyntaxType.GLOBAL);
            (0, chai_1.expect)(second.Type).to.equal(SyntaxType_1.SyntaxType.IDENTIFIER);
            (0, chai_1.expect)(third.Type).to.equal(SyntaxType_1.SyntaxType.EQUAL);
            (0, chai_1.expect)(fourth.Type).to.equal(SyntaxType_1.SyntaxType.NUMBER);
            (0, chai_1.expect)(fifth.Type).to.equal(SyntaxType_1.SyntaxType.SEMICOLON);
        });
        it("should produce proper lexemes", () => {
            (0, chai_1.expect)(first.Lexeme).to.equal("global");
            (0, chai_1.expect)(second.Lexeme).to.equal("var");
            (0, chai_1.expect)(third.Lexeme).to.equal("=");
            (0, chai_1.expect)(fourth.Lexeme).to.equal("8");
            (0, chai_1.expect)(fifth.Lexeme).to.equal(";");
        });
        it("should produce proper literals", () => {
            (0, chai_1.expect)(first.Literal).to.equal(null);
            (0, chai_1.expect)(second.Literal).to.equal(null);
            (0, chai_1.expect)(third.Literal).to.equal(null);
            (0, chai_1.expect)(fourth.Literal).to.equal(8);
            (0, chai_1.expect)(fifth.Literal).to.equal(null);
        });
    });
    (0, mocha_1.describe)("Local assignment", () => {
        const lexer = new Lexer_1.Lexer("let value = 'hello';");
        const tokens = lexer.Tokenize();
        const first = tokens[0], second = tokens[1], third = tokens[2], fourth = tokens[3], fifth = tokens[4];
        it("should produce 5 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(5));
        it("should have let, identifier, equals, string, and semicolon tokens", () => {
            (0, chai_1.expect)(first.Type).to.equal(SyntaxType_1.SyntaxType.GLOBAL);
            (0, chai_1.expect)(second.Type).to.equal(SyntaxType_1.SyntaxType.IDENTIFIER);
            (0, chai_1.expect)(third.Type).to.equal(SyntaxType_1.SyntaxType.EQUAL);
            (0, chai_1.expect)(fourth.Type).to.equal(SyntaxType_1.SyntaxType.STRING);
            (0, chai_1.expect)(fifth.Type).to.equal(SyntaxType_1.SyntaxType.SEMICOLON);
        });
        it("should produce proper lexemes", () => {
            (0, chai_1.expect)(first.Lexeme).to.equal("let");
            (0, chai_1.expect)(second.Lexeme).to.equal("value");
            (0, chai_1.expect)(third.Lexeme).to.equal("=");
            (0, chai_1.expect)(fourth.Lexeme).to.equal("'hello'");
            (0, chai_1.expect)(fifth.Lexeme).to.equal(";");
        });
        it("should produce proper literals", () => {
            (0, chai_1.expect)(first.Literal).to.equal(null);
            (0, chai_1.expect)(second.Literal).to.equal(null);
            (0, chai_1.expect)(third.Literal).to.equal(null);
            (0, chai_1.expect)(fourth.Literal).to.equal("hello");
            (0, chai_1.expect)(fifth.Literal).to.equal(null);
        });
    });
    (0, mocha_1.describe)("Comment test", () => {
        const lexer = new Lexer_1.Lexer("## This is a comment. ##: this is a multiline comment :##");
        const tokens = lexer.Tokenize();
        it("should produce 0 tokens", () => (0, chai_1.expect)(tokens.length - 1).to.equal(0));
    });
    (0, mocha_1.describe)("Error reporting test", () => {
        const lexer = new Lexer_1.Lexer("$@\\");
        it("should raise an unexpected character error", () => (0, chai_1.expect)(lexer.Tokenize).to.throw());
    });
});
