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
    ArrowFunctionExpression,
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
            } else {
                path.skip();
            }
        },
        AssignmentExpression(path: NodePath<AssignmentExpression>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = getLValVariables(node.left);
            } else {
                path.skip();
            }
        },
        UpdateExpression(path: NodePath<UpdateExpression>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = getExpressionVariables(
                    node.argument
                );
            } else {
                path.skip();
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
            } else {
                path.skip();
            }
        },
        ExpressionStatement(path: NodePath<ExpressionStatement>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                const expression = node.expression;
                consoleVariable.variables = getExpressionVariables(expression);
            } else {
                path.skip();
            }
        },
        ObjectMethod(path: NodePath<ObjectMethod>) {
            const node = path.node;
            if (isContain(node, offset)) {
                if (node.key.type === "Identifier") {
                    consoleVariable.funcName = node.key.name;
                }
                if (node.key.type === "StringLiteral") {
                    consoleVariable.funcName = node.key.value;
                }
                consoleVariable.variables = node.params.reduce(
                    (pre: string[], param): string[] => {
                        return pre.concat(getLValVariables(param));
                    },
                    []
                );
            } else {
                path.skip();
            }
        },
        ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = node.params.reduce(
                    (pre: string[], param): string[] => {
                        return pre.concat(getLValVariables(param));
                    },
                    []
                );
            } else {
                path.skip();
            }
        },
    });

    return consoleVariable;
}

export function getConsoleRangeJs(code: string, offset: number = 0) {
    const ast = parse(code);
    const rangeList: ConsoleRange[] = [];
    traverse.default(ast, {
        ExpressionStatement(path: NodePath<ExpressionStatement>) {
            const node = path.node;
            const { start, end, expression } = node;
            if (
                start &&
                end &&
                expression.type === "CallExpression" &&
                expression.callee.type === "MemberExpression"
            ) {
                const memberExpression = expression.callee;
                if (
                    memberExpression.object.type === "Identifier" &&
                    memberExpression.object.name === "console" &&
                    memberExpression.property.type === "Identifier"
                ) {
                    rangeList.push({
                        name: memberExpression.property.name,
                        range: [start + offset, end + offset],
                    });
                } 
            }
            path.skip();
        },
    });
    return rangeList;
}
