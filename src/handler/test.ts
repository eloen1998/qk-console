// import traverse from "@babel/traverse";
const traverse = require("@babel/traverse");
import { parse } from "../parse";

function getVariable(code: string) {
    const ast = parse(code);

    traverse.default(ast, {
        enter(path) {
            console.log('path:', path.node.type, path.node?.name);
        },
        ObjectMethod(path) {
            const node = path.node;
            console.log('666:', node);
        }
    });
}

const code = `
const m = {
    n(a) {
    }
};`;



getVariable(code);
