import { describe, it, expect, test } from "vitest";
import { getVariable } from "../nodeHanlers";
import fs from "fs";

function myRead() :Promise<string> {
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
  it("should simple", () => {
    const name = getVariable(code, 11);
    expect(name).toEqual({ funcName: "", variables: ["a"] });
  });

  it("should simple2", () => {
    const name = getVariable(code, 19);
    expect(name).toEqual({ funcName: "", variables: ["b"] });
  });
  it("should simple3", () => {
    const name = getVariable(code, 26);
    expect(name).toEqual({ funcName: "", variables: "b" });
  });
  // it("should simple3", () => {
  //   const name = getVariable(code, 8);
  //   expect(name).toEqual({ variables: ["c", "d"] });
  // });
  // it("should simple4", () => {
  //   const name = getVariable(code, 11);
  //   expect(name).toEqual({ variables: ["e", "f"] });
  // });
  // it("should simple5", () => {
  //   const name = getVariable(code, 14);
  //   expect(name).toEqual({ func: "g",variables: ["h"] });
  // });
  // it("should simple6", () => {
  //   const name = getVariable(code, 18);
  //   expect(name).toEqual({ func: "i",variables: ["j", "k"] });
  // });
  // it("should simple7", () => {
  //   const name = getVariable(code, 2);
  //   expect(name).toEqual({ func: "l" });
  // });
  // it("should simple8", () => {
  //   const name = getVariable(code, 26);
  //   expect(name).toEqual({ func: "m",variables: ["n"] });
  // });
});
