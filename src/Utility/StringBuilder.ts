export class StringBuilder {
    private content = "";

    public AppendLine(content: string = ""): StringBuilder {
        this.content += content + "\n";
        return this;
    }

    public Append(content: string): StringBuilder {
        this.content += content;
        return this;
    }

    public ToString(): string {
        return this.content;
    }
}