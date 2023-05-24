import { describe, it, expect } from "vitest";
import { getVariableVue } from "../handler/handleVue";
import path from "path";
import fs from "fs";

describe("get variable in vue", async () => {
    const code = fs.readFileSync(path.join(__dirname, "./code.vue"), "utf-8");
    it("this变量识别", () => {
        const name = getVariableVue(code, 387);
        expect(name).toEqual({ variables: ["this.bb.ccc"] });
    });
    it("对象取值识别", () => {
        const name = getVariableVue(code, 408);
        expect(name).toEqual({ variables: ["a.b"] });
    });
    it("数组取值识别", () => {
        const name = getVariableVue(code, 433);
        expect(name).toEqual({ variables: ["list[0]"] });
    });
});
