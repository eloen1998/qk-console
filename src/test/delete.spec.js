import { describe, it, expect, test } from "vitest";
import { getConsoleRangeJs } from "../handler/handleJs";
describe("get consoleRange", async () => {
    it("log声明语句", () => {
        const code = `
        console.log(111)
        console.log(222)
`;
        const name = getConsoleRangeJs(code);
        expect(name).toEqual([
            {
                name: "log",
                range: [9, 25],
            },
            {
                name: "log",
                range: [34, 50],
            },
        ]);
    });

    it("warn声明语句", () => {
        const code = `
        console.warn(111)
        console.log(222)
`;
        const name = getConsoleRangeJs(code);
        expect(name).toEqual([
            {
                name: "warn",
                range: [9, 26],
            },
            {
                name: "log",
                range: [35, 51],
            },
        ]);
    });
});
