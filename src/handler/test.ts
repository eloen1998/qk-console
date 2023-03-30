/**
 * test
 * 用于试验 traverse 的功能
 * 开启watch模式情况下
 * 可使用 node out/handler/test.js 运行
 */
const traverse = require("@babel/traverse");
import { parse } from "../parse";

function getVariable(code: string) {
    const ast = parse(code);

    traverse.default(ast, {
        enter(path) {
            console.log("path:", path.node.type, path.node?.name);
        },
        NumericLiteral(path) {
            const node = path.node;
            console.log("node:", node);
        },
    });
}

const code = `
const list = [];
list[0] = 1`;

getVariable(code);
