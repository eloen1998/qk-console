// 这里使用import语法会导致在使用traverse时出现问题：在执行测试用例时需要使用traverse.default，而在运行插件时需要使用traverse。
// import traverse from "@babel/traverse";
const traverse = require("@babel/traverse");
import { parse } from "../parse";
import {
    ObjectMethod,
    UpdateExpression,
    FunctionDeclaration,
    VariableDeclaration,
    ExpressionStatement,
    AssignmentExpression,
} from "@babel/types";
import {
    isContain,
    getLValVariables,
    getExpressionVariables,
} from "./handleNode";
import type { NodePath } from "@babel/traverse";

export function getVariableJs(code: string, offset: number): ConsoleVariable {
    const consoleVariable: ConsoleVariable = {};
    const ast = parse(code);

    traverse.default(ast, {
        VariableDeclaration(path: NodePath<VariableDeclaration>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = node.declarations.reduce(
                    (pre: string[], declaration): string[] => {
                        return pre.concat(getLValVariables(declaration.id));
                    },
                    []
                );
            }
        },
        AssignmentExpression(path: NodePath<AssignmentExpression>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = getLValVariables(node.left);
            }
        },
        UpdateExpression(path: NodePath<UpdateExpression>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = getExpressionVariables(
                    node.argument
                );
            }
        },
        FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.funcName = node.id?.name;
                consoleVariable.variables = node.params.reduce(
                    (pre: string[], param): string[] => {
                        return pre.concat(getLValVariables(param));
                    },
                    []
                );
            }
        },
        ExpressionStatement(path: NodePath<ExpressionStatement>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                const expression = node.expression;
                consoleVariable.variables = getExpressionVariables(expression);
            }
        },
        ObjectMethod(path: NodePath<ObjectMethod>) {
            const node = path.node;
            if (isContain(node, offset)) {
                if (node.key.type === "Identifier") {
                    consoleVariable.funcName = node.key.name;
                }
                consoleVariable.variables = node.params.reduce(
                    (pre: string[], param): string[] => {
                        return pre.concat(getLValVariables(param));
                    },
                    []
                );
            }
        },
    });

    return consoleVariable;
}

export function getConsoleRangeJs(code: string) {
    const ast = parse(code);
    const rangeList: ConsoleRange[] = [];
    traverse.default(ast, {
        ExpressionStatement(path: NodePath<ExpressionStatement>) {
            const node = path.node;
            const { expression } = node;
            if (node.start && node.end) {
                if (expression.type === "CallExpression") {
                    if (expression.callee.type === "MemberExpression") {
                        const memberExpression = expression.callee;
                        if (memberExpression.object.type === "Identifier") {
                            if (memberExpression.object.name === "console") {
                                if (
                                    memberExpression.property.type === "Identifier"
                                ) {
                                    // console.log(node?.loc?.start);
                                    // console.log(node?.loc?.end);
                                    
                                    rangeList.push({
                                        name: memberExpression.property.name,
                                        range: [node.start, node.end],
                                    });
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        },
    });
    return rangeList;
}
