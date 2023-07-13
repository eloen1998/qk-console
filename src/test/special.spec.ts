import { describe, it, expect } from "vitest";
import { getVariableJs } from "../handler/handleJs";
describe("特殊语句的获取变量", async () => {
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
    it("for in语句", () => {
        const code = `for (let item in list) {

        }`;
        const name = getVariableJs(code, 24);
        expect(name).toEqual({ funcName: "for in", variables: ["item"] });
    });
    it("for of语句", () => {
        const code = `for (let item of list) {

        }`;
        const name = getVariableJs(code, 24);
        expect(name).toEqual({ funcName: "for of", variables: ["item"] });
    });
    it("switch case语句", () => {
        const code = `switch (a) {
            case 1:
                break;
        }`;
        const name = getVariableJs(code, 12);
        expect(name).toEqual({ funcName: "switch", variables: ["a"] });
    });
});
