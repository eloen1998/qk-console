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
        }
    });
}

const code = `
const m = {
    n(a) {
        const c = 7;
    }
};`;



getVariable(code);
