import { describe, it, expect } from "vitest";
import { getConsoleRangeVue } from "../handler/handleVue";
import path from "path";
import fs from "fs";

describe("get consoleRange in vue", () => {
    const code = fs.readFileSync(path.join(__dirname, "./code.vue"), "utf-8");
    it("获取console.log范围", () => {
        const consoleRange = getConsoleRangeVue(code);
        expect(consoleRange).toEqual([
            {
                name: "log",
                range: [446, 465]
            },
            {
                name: "log",
                range: [603, 631]
            }
        ]);
    });
});
