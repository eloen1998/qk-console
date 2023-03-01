import { describe, it, expect, test } from "vitest";
import { getVariableVue } from "../handler/handleVue";
import fs from "fs";

function myRead(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(
            "/Users/admin/Project/PERSONAL/quickconsole/src/test/code.vue",
            "utf-8",
            (error, data) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }
                resolve(data);
            }
        );
    });
}

describe("test traverse", async () => {
    const code = await myRead();
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
