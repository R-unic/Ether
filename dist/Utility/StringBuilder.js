"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringBuilder = void 0;
class StringBuilder {
    constructor() {
        this.content = "";
    }
    AppendLine(content = "") {
        this.content += content + "\n";
        return this;
    }
    Append(content) {
        this.content += content;
        return this;
    }
    ToString() {
        return this.content;
    }
}
exports.StringBuilder = StringBuilder;
