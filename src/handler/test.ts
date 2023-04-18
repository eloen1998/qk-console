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
            const { start, end } = path.node;
            console.log("path:", start, end);
            if (start < 13 && end > 13) {
                console.log('go on');
            } else {
                path.skip();
            }
        },
        VariableDeclaration(path) {
            counter++;
            // path.skip();
        },
        VariableDeclarator(path) {
            counter++;
            // path.skip();
        },
        Identifier(path) {
            counter++;
            // path.skip();
        },
    });
    console.log("counter:", counter);
}

const code = `
const list = [];
const list2 = [];`;

getVariable(code);
