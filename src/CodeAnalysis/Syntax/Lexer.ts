import { Ether } from "../../Ether";
import { SyntaxType } from "./SyntaxType";
import { Keywords } from "./Keywords";
import { Token } from "./Token";

export class Lexer {
    private readonly tokens: Token[] = [];
    private start = 0;
    private current = 0;
    private line = 0;

    public constructor(
        private readonly source: string
    ) {}

    private get Completed() {
        return this.current >= this.source.length;
    }

    public ScanTokens(): Token[] {
        while (!this.Completed) {
            this.start = this.current;
            this.ScanToken();
        }

        this.tokens.push(new Token(SyntaxType.EOF, "", null, this.line));
        return this.tokens;
    }

    private ScanToken(): void {
        const c: string = this.Advance();
        switch (c) {
            case "(": this.AddToken(SyntaxType.LEFT_PAREN); break;
            case ")": this.AddToken(SyntaxType.RIGHT_PAREN); break;
            case "{": this.AddToken(SyntaxType.LEFT_BRACE); break;
            case "}": this.AddToken(SyntaxType.RIGHT_BRACE); break;
            case ",": this.AddToken(SyntaxType.COMMA); break;
            case ".": this.AddToken(SyntaxType.DOT); break;
            case "-": this.AddToken(SyntaxType.MINUS); break;
            case "+": this.AddToken(SyntaxType.PLUS); break;
            case ";": this.AddToken(SyntaxType.SEMICOLON); break;
            case "*": this.AddToken(SyntaxType.STAR); break;
            case '/': this.AddToken(SyntaxType.SLASH); break;
            case "^": this.AddToken(SyntaxType.CARAT); break;
            case "%": this.AddToken(SyntaxType.PERCENT); break;
            case "#": 
                if (this.Match("#"))
                    while (this.Peek() !== '\n' && !this.Completed)
                        this.Advance();
                else
                    this.AddToken(SyntaxType.HASHTAG);
                break;
            case '!':
                this.AddToken(this.Match('=') ? SyntaxType.BANG_EQUAL : SyntaxType.BANG);
                break;
            case '=':
                this.AddToken(this.Match('=') ? SyntaxType.EQUAL_EQUAL : SyntaxType.EQUAL);
                break;
            case '<':
                this.AddToken(this.Match('=') ? SyntaxType.LESS_EQUAL : SyntaxType.LESS);
                break;
            case '>':
                this.AddToken(this.Match('=') ? SyntaxType.GREATER_EQUAL : SyntaxType.GREATER);
                break;

            case ' ':
            case '\r':
            case '\t':
                break;
        
            case '\n':
                this.line++;
                break;

            case '"':
                this.String();
                break;

            case "|":
                this.AddToken(SyntaxType.OR); break;
            case "&":
                this.AddToken(SyntaxType.AND); break;

            default:
                if (this.IsDigit(c))
                    this.Number();
                else if (this.IsAlpha(c))
                    this.Identifier();
                else
                    Ether.Error(this.line, "Unexpected character.");
                break;
        }
    }

    private Advance(): string {
        return this.source.charAt(this.current++);
    }

    private AddToken(type: SyntaxType, literal: any = null): void {
        const text = this.source.substring(this.start, this.current);
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
        return this.IsAlpha(c) || this.IsDigit(c);
    }

    private Identifier(): void {
        while (this.IsAlphaNumeric(this.Peek()))
            this.Advance();

        const text = this.source.substring(this.start, this.current);
        let type = Keywords.get(text)?? SyntaxType.IDENTIFIER;
        this.AddToken(type);
    }

    private String(): void {
        while (this.Peek() !== '"' && !this.Completed) {
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
        this.AddToken(SyntaxType.STRING, value);
    }

    private Number(): void {
        while (this.IsDigit(this.Peek()))
            this.Advance();

        if (this.Peek() === "." && this.IsDigit(this.Peek(1))) {
            this.Advance();
            while (this.IsDigit(this.Peek()))
                this.Advance();
        }
            
        this.AddToken(SyntaxType.NUMBER, parseFloat(this.source.substring(this.start, this.current)));
    }
}