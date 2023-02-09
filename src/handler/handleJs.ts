// import traverse from "@babel/traverse";
const traverse = require("@babel/traverse");
import type { NodePath } from "@babel/traverse";
import {
    FunctionDeclaration,
    Identifier,
    BlockStatement,
    VariableDeclaration,
    Node,
    ExpressionStatement,
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
                delete consoleVariable.funcName;
                consoleVariable.variables = node.declarations.reduce(
                    (pre, declaration) => {
                        if (declaration.id.type === "Identifier") {
                            return pre.concat([declaration.id.name]);
                        }
                        if (declaration.id.type === "ObjectPattern") {
                            const objectPatterns =
                                declaration.id.properties.map((property) => {
                                    return property.key.name;
                                });
                            return pre.concat(objectPatterns);
                        }
                        if (declaration.id.type === "ArrayPattern") {
                            const arrayPatterns = declaration.id.elements.map(
                                (identifier) => {
                                    return identifier.name;
                                }
                            );
                            return pre.concat(arrayPatterns);
                        }
                    },
                    []
                );
            }
        },
        AssignmentExpression(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = node.left.name;
            }
        },
        UpdateExpression(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = node.argument.name;
            }
        },
        FunctionDeclaration(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.funcName = node.id?.name;
                consoleVariable.variables = node.params?.map(
                    (identifier) => identifier.name
                );
            }
        },
        ExpressionStatement(path) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                const expression = node.expression;
                if (expression.type === "AssignmentExpression") {
                    if (expression.left.type === "Identifier") {
                        consoleVariable.variables = expression.left.name;
                    }
                    if (expression.left.type === "MemberExpression") {
                        consoleVariable.variables = getMemberExperssion(
                            expression.left
                        );
                    }
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
                consoleVariable.variables = node.params.map(
                    (param) => param.name
                );
            }
        },
    });

    return consoleVariable;
}

function isContain(node, index: number) {
    return index >= node.start && index <= node.end;
}

// a.b[c]形式的语法识别
function getMemberExperssion(memberExperssion, suf: string = "") {
    let newSuf = "";
    const { property, object } = memberExperssion;
    if (property.type === "Identifier") {
        if (memberExperssion.computed) {
            newSuf = "[" + property.name + "]" + suf;
        } else {
            newSuf = "." + property.name + suf;
        }
    }
    if (property.type === "NumericLiteral") {
        newSuf = "[" + property.value + "]" + suf;
    }
    if (object.type === "Identifier") {
        return object.name + newSuf;
    }
    if (object.type === "ThisExpression") {
        return "this" + newSuf;
    }
    if (object.type === "MemberExpression") {
        return getMemberExperssion(object, newSuf);
    }
}
