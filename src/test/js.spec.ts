import { describe, it, expect, test } from "vitest";
import { getVariableJs } from "../handler/handleJs";
describe("get variable", async () => {
    it("const变量声明语句", () => {
        const code = `const a = 1;`;
        const name = getVariableJs(code, 12);
        expect(name).toEqual({ variables: ["a"] });
    });

    it("let变量声明语句", () => {
        const code = `let b;`;
        const name = getVariableJs(code, 6);
        expect(name).toEqual({ variables: ["b"] });
    });
    it("变量赋值语句", () => {
        const code = `b = 5;`;
        const name = getVariableJs(code, 6);
        expect(name).toEqual({ variables: ["b"] });
    });
    it("变量赋值语句", () => {
        const code = `b++;`;
        const name = getVariableJs(code, 4);
        expect(name).toEqual({ variables: ["b"] });
    });
    it("对象解构赋值语句", () => {
        const code = `const { c, d } = { c: 3, d: 4 };`;
        const name = getVariableJs(code, 32);
        expect(name).toEqual({ variables: ["c", "d"] });
    });
    it("数组解构赋值语句", () => {
        const code = `const [e, f] = [5, 6];`;
        const name = getVariableJs(code, 22);
        expect(name).toEqual({ variables: ["e", "f"] });
    });
    it("复杂解构赋值语句", () => {
        const code = `const {
            a: {
                b: e,
                f: [g, q],
            },
        } = { a: { b: 3, f: [1, 2] } };`;
        const name = getVariableJs(code, 22);
        expect(name).toEqual({ variables: ["e", "g", "q"] });
    });
    it("函数声明语句(没有参数)", () => {
        const code = `function l() {}`;
        const name = getVariableJs(code, 14);
        expect(name).toEqual({ funcName: "l", variables: [] });
    });
    it("函数声明语句(一个参数)", () => {
        const code = `function g(h) {}`;
        const name = getVariableJs(code, 15);
        expect(name).toEqual({ funcName: "g", variables: ["h"] });
    });
    it("函数声明语句(两个参数)", () => {
        const code = `function i(j, k) {}`;
        const name = getVariableJs(code, 18);
        expect(name).toEqual({ funcName: "i", variables: ["j", "k"] });
    });
    it("函数参数（对象）解构赋值", () => {
        const code = `function i({j, k}) {}`;
        const name = getVariableJs(code, 20);
        expect(name).toEqual({ funcName: "i", variables: ["j", "k"] });
    });
    it("函数参数（数组）解构赋值", () => {
        const code = `function i([j, k]) {}`;
        const name = getVariableJs(code, 20);
        expect(name).toEqual({ funcName: "i", variables: ["j", "k"] });
    });
    it("函数参数（数组、对象、普通混合）解构赋值", () => {
        const code = `function i([j, k], [l, m] , n) {}`;
        const name = getVariableJs(code, 32);
        expect(name).toEqual({
            funcName: "i",
            variables: ["j", "k", "l", "m", "n"]
        });
    });
    it("对象中的函数声明", () => {
        const code = `const m = {
            n() {}
        };`;
        const name = getVariableJs(code, 29);
        expect(name).toEqual({ funcName: "n", variables: [] });
    });
    it("对象中的函数声明2", () => {
        const code = `const watch = {
            'form.name'() {}
        };`;
        const name = getVariableJs(code, 44);
        expect(name).toEqual({ funcName: "form.name", variables: [] });
    });
    it("函数中变量声明", () => {
        const code = `function fun() {
            const a = 6;
        }`;
        const name = getVariableJs(code, 41);
        expect(name).toEqual({ variables: ["a"] });
    });
    it("箭头函数", () => {
        const code = `const a = (s) => {

        }`;
        const name = getVariableJs(code, 18);
        expect(name).toEqual({ variables: ["s"] });
    });
    it("if语句", () => {
        const code = `function fun() {
            if (a) {
                const b = 1;
            }
        }`;
        const name = getVariableJs(code, 37);
        expect(name).toEqual({ variables: ["a"] });
    });
    it("import语句1", () => {
        const code = `import * as d from './d'`;
        const name = getVariableJs(code, 24);
        expect(name).toEqual({ variables: ["d"] });
    });
    it("import语句2", () => {
        const code = `import a from './a';`;
        const name = getVariableJs(code, 20);
        expect(name).toEqual({ variables: ["a"] });
    });
    it("import语句3", () => {
        const code = `import {b as c, e, f} from './b'`;
        const name = getVariableJs(code, 32);
        expect(name).toEqual({ variables: ["c", "e", "f"] });
    });
});
