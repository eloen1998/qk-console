// import traverse from "@babel/traverse";
const traverse = require("@babel/traverse");
import type { NodePath } from "@babel/traverse";
import {
    FunctionDeclaration,
    Identifier,
    BlockStatement,
    VariableDeclaration,
    Node
} from "@babel/types";
import { parse } from "../parse";
import type { ConsoleVariable } from "../types";

export function getVariableJs(code: string, offset: number): ConsoleVariable {
    const consoleVariable: ConsoleVariable = {};
    const ast = parse(code);

    traverse.default(ast, {
        VariableDeclaration(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.variables = node.declarations.reduce(
                    (pre,declaration) => {
                        if (declaration.id.type === 'Identifier') {
                            return pre.concat([declaration.id.name]);
                        }
                        if (declaration.id.type === 'ObjectPattern') {
                            const objectPatterns = declaration.id.properties.map(property => {
                                return property.key.name;
                            });
                            return pre.concat(objectPatterns);
                        }
                        if (declaration.id.type === 'ArrayPattern') {
                            const arrayPatterns = declaration.id.elements.map(identifier => {
                                return identifier.name;
                            });
                            return pre.concat(arrayPatterns);
                        }
                    }, []
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
        FunctionDeclaration(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.funcName = node.id?.name;
                consoleVariable.variables = node.params?.map(identifier => identifier.name);
            }
        },
        ExpressionStatement(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                const expression = node.expression;
                if (expression.type === "AssignmentExpression") {
                    consoleVariable.variables = expression.left.name;
                }
                if (expression.type === "UpdateExpression") {
                    consoleVariable.variables = expression.argument.name;
                }
            }
        },
        ObjectMethod(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.funcName = node.key.name;
                consoleVariable.variables = node.params.map(param => param.name);
            }
        }
    });

    return consoleVariable;
}

function isContain(node, index: number) {
    return index >= node.start && index <= node.end;
}
