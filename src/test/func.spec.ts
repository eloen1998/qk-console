import { describe, it, expect, test } from "vitest";
import { getVariable } from "../nodeHanlers";
import fs from "fs";

function myRead(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(
            "/Users/admin/Project/PERSONAL/quickconsole/src/test/code.js",
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
    it("const变量声明语句", () => {
        const name = getVariable(code, 11);
        expect(name).toEqual({ variables: ["a"] });
    });

    it("let变量声明语句", () => {
        const name = getVariable(code, 19);
        expect(name).toEqual({ variables: ["b"] });
    });
    it("变量赋值语句", () => {
        const name = getVariable(code, 26);
        expect(name).toEqual({ variables: "b" });
    });
    it("变量赋值语句", () => {
        const name = getVariable(code, 32);
        expect(name).toEqual({ variables: "b" });
    });
    it("对象结构赋值语句", () => {
        const name = getVariable(code, 66);
        expect(name).toEqual({ variables: ["c", "d"] });
    });
    it("数组结构赋值语句", () => {
        const name = getVariable(code, 90);
        expect(name).toEqual({ variables: ["e", "f"] });
    });
    it("函数声明语句(一个参数)", () => {
        const name = getVariable(code, 107);
        expect(name).toEqual({ funcName: "g", variables: ["h"] });
    });
    it("函数声明语句(两个参数)", () => {
        const name = getVariable(code, 129);
        expect(name).toEqual({ funcName: "i", variables: ["j", "k"] });
    });
    it("函数声明语句(没有参数)", () => {
        const name = getVariable(code, 147);
        expect(name).toEqual({ funcName: "l", variables: [] });
    });
    it("对象中的函数声明", () => {
        const name = getVariable(code, 172);
        expect(name).toEqual({ funcName: "n", variables: [] });
    });
    // it("should simple8", () => {
    //   const name = getVariable(code, 26);
    //   expect(name).toEqual({ func: "m",variables: ["n"] });
    // });
});
