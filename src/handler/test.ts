// import traverse from "@babel/traverse";
const traverse = require("@babel/traverse");
import { parse } from "../parse";

function getVariable(code: string) {
    const ast = parse(code);

    traverse.default(ast, {
        enter(path) {
            console.log('path:', path.node.type, path.node?.name);
        },
        NumericLiteral(path) {
            const node = path.node;
            console.log('node:', node)
        }
    });
}

const code = `
const list = [];
list[0] = 1`;



getVariable(code);
