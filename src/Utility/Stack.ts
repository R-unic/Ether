export class Stack<T> {
    private readonly cache: T[] = [];

    public Push(value: T): number {
        return this.cache.push(value) + 1;
    }

    public Pop(): T {
        if (this.Size === 0)
            throw new Error("Stack underflow.");

        return this.cache.pop() as T;
    }

    public Peek(index: number = this.Size): T | undefined {
        return this.Get(index);
    }

    public Get(index: number): T | undefined {
        return this.cache[index - 1]
    }

    public get First() {
        return this.cache[0];
    }

    public get Size() {
        return this.cache.length;
    }

    public get Empty() {
        return this.Size === 0;
    }
}