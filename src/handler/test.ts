/**
 * test
 * 用于试验 traverse 的功能
 * 开启watch模式情况下，可使用 node out/handler/test.js 运行
 */
const traverse = require("@babel/traverse");
import { parse } from "../parse";

function getVariable(code: string) {
    const ast = parse(code);
    let counter = 0;

    traverse.default(ast, {
        enter(path) {
            const nodeType = path.node.type;
            console.log('nodeType', nodeType);
        },
        IfStatement(path: any) {
            const node = path.node;
            console.log('node', node);
        }
    });
    console.log("counter:", counter);
}

const code = `function fun() {
    if (a) {
        const b = 1;
    }
}`;

getVariable(code);
