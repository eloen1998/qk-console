import { describe, it, expect } from "vitest";
import { getConsoleRangeVue } from "../handler/handleVue";
import readFile from "../utils/readFile";
import path from "path";

describe("get consoleRange in vue", async () => {
    const code = await readFile(path.join(__dirname, "./code.vue"));
    it("this变量识别", () => {
        const consoleRange = getConsoleRangeVue(code);
        expect(consoleRange).toEqual([
            {
                name: "log",
                range: [446, 465],
            },
        ]);
    });
});
