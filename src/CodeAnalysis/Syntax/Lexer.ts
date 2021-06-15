import { Ether } from "../../Ether";
import { SyntaxType as Syntax } from "./SyntaxType";
import { Keywords } from "./Keywords";
import { Token } from "./Token";

export class Lexer {
    private readonly tokens: Token[] = [];
    private start = 0;
    private current = 0;
    private line = 1;

    public constructor(
        private readonly source: string
    ) {}

    private get Completed() {
        return this.current >= this.source.length;
    }

    public LexTokens(): Token[] {
        while (!this.Completed) {
            this.start = this.current;
            this.Lex();
        }

        this.tokens.push(new Token(Syntax.EOF, "", null, this.line));
        return this.tokens;
    }

    private Lex(): void {
        const char: string = this.Advance();
        switch (char) {
            case "(": this.AddToken(Syntax.LEFT_PAREN); break;
            case ")": this.AddToken(Syntax.RIGHT_PAREN); break;
            case "{": this.AddToken(Syntax.LEFT_BRACE); break;
            case "}": this.AddToken(Syntax.RIGHT_BRACE); break;
            case ",": this.AddToken(Syntax.COMMA); break;
            case ".": this.AddToken(Syntax.DOT); break;
            case "-": this.AddToken(Syntax.MINUS); break;
            case "+": this.AddToken(Syntax.PLUS); break;
            case ";": this.AddToken(Syntax.SEMICOLON); break;
            case "*": this.AddToken(Syntax.STAR); break;
            case '/': this.AddToken(Syntax.SLASH); break;
            case "^": this.AddToken(Syntax.CARAT); break;
            case "%": this.AddToken(Syntax.PERCENT); break;
            case "#": 
                if (this.Match("#"))
                    this.SkipComment();
                else
                    this.AddToken(Syntax.HASHTAG);
                break;
            case '!':
                this.AddToken(this.Match('=') ? Syntax.BANG_EQUAL : Syntax.BANG);
                break;
            case '=':
                this.AddToken(this.Match('=') ? Syntax.EQUAL_EQUAL : Syntax.EQUAL);
                break;
            case '<':
                this.AddToken(this.Match('=') ? Syntax.LESS_EQUAL : Syntax.LESS);
                break;
            case '>':
                this.AddToken(this.Match('=') ? Syntax.GREATER_EQUAL : Syntax.GREATER);
                break;

            case ' ':
            case '\r':
            case '\t':
                break;
        
            case '\n':
                this.line++;
                break;

            case "'":
            case '"':
                this.String();
                break;

            case "|":
                this.AddToken(Syntax.OR); break;
            case "&":
                this.AddToken(Syntax.AND); break;

            default:
                if (this.IsDigit(char))
                    this.Number();
                else if (this.IsAlpha(char))
                    this.Identifier();
                else
                    Ether.Error(this.line, "Unexpected character.");
                break;
        }
    }

    private SkipComment(): void {
        while (this.Peek() !== "\n" && !this.Completed)
            this.Advance();
    }

    private Advance(): string {
        return this.source.charAt(this.current++);
    }

    private AddToken(type: Syntax, literal: any = null): void {
        const text = this.source.substring(this.start, this.current).trim();
        this.tokens.push(new Token(type, text, literal, this.line));
    }

    private Match(expected: string): boolean {
        if (this.Completed)
            return false;

        if (this.source.charAt(this.current) !== expected)
            return false;

        this.current++;
        return true;
    }

    private Peek(offset: number = 0): string {
        if (this.Completed)
            return "\0";

        if (this.current + offset >= this.source.length)
            return "\0";

        return this.source.charAt(this.current + offset);
    }

    private IsAlpha(c: string): boolean {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_';
    }  

    private IsDigit(c: string): boolean {
        return !isNaN(Number(c))
    }

    private IsAlphaNumeric(c: string): boolean {
        return c === " " ? false : this.IsAlpha(c) || this.IsDigit(c);
    }

    private Identifier(): void {
        while (this.IsAlphaNumeric(this.Peek()))
            this.Advance();

        const text = this.source.substring(this.start, this.current).trim();
        let type = Keywords.get(text)?? Syntax.IDENTIFIER;
        this.AddToken(type);
    }

    private String(): void {        
        while ((this.Peek() !== '"' && this.Peek() !== "'") && !this.Completed) {
            if (this.Peek() === "\n")
                this.line++;

            this.Advance();
        }

        if (this.Completed) {
            Ether.Error(this.line, "Unterminated string.");
            return;
        }

        this.Advance();

        const value = this.source.substring(this.start + 1, this.current - 1);        
        this.AddToken(Syntax.STRING, value);
    }

    private Number(): void {
        while (this.IsDigit(this.Peek()))
            this.Advance();

        if (this.Peek() === "." && this.IsDigit(this.Peek(1))) {
            this.Advance();
            while (this.IsDigit(this.Peek()))
                this.Advance();
        }
            
        this.AddToken(Syntax.NUMBER, Number(this.source.substring(this.start, this.current)));
    }
}