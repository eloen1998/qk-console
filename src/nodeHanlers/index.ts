// import traverse from "@babel/traverse";
const traverse = require("@babel/traverse");
import type { NodePath } from "@babel/traverse";
import {
    FunctionDeclaration,
    Identifier,
    BlockStatement,
    VariableDeclaration,
    Node,
} from "@babel/types";
import { parse } from "../parse";

type ConsoleVariable = {
    funcName: string;
    variables: string[] | string;
};

export function getVariable(code: string, offset: number): ConsoleVariable {
    const consoleVariable: ConsoleVariable = {
        funcName: "",
        variables: "",
    };
    const ast = parse(code);

    traverse.default(ast, {
        VariableDeclaration(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.variables = node.declarations.map(
                    (declaration) => {
                        return declaration.id.name;
                    }
                );
            }
        },
        AssignmentExpression(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.variables = node.left.name;
            }
        },
        UpdateExpression(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.variables = node.argument.name;
            }
        },
        // FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
        //   console.log(path);
        // },
        // BlockStatement(path: NodePath<BlockStatement>) {
        //   console.log(path);
        // },
    });

    return consoleVariable;
}

function isContain(node, index: number) {
    return index >= node.start && index <= node.end;
}
