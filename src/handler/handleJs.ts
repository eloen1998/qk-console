// 这里使用import语法会导致在使用traverse时出现问题：在执行测试用例时需要使用traverse.default，而在运行插件时需要使用traverse。
// import traverse from "@babel/traverse";
const traverse = require("@babel/traverse");
import { parse } from "../parse";
import {
    LVal,
    Expression,
    ArrayPattern,
    ObjectMethod,
    ObjectPattern,
    UpdateExpression,
    MemberExpression,
    AssignmentPattern,
    FunctionDeclaration,
    VariableDeclaration,
    ExpressionStatement,
    AssignmentExpression,
} from "@babel/types";
import type { NodePath } from "@babel/traverse";
import type { ConsoleVariable } from "../types";

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

function isContain(node, index: number) {
    return index >= node.start && index <= node.end;
}

function getLValVariables(lVal: LVal): string[] {
    switch (lVal.type) {
        case "Identifier":
            return [lVal.name];

        case "RestElement":
            return getLValVariables(lVal.argument);

        case "AssignmentPattern":
            return getAssignmentPatternVariables(lVal);

        case "ArrayPattern":
            return getArrayPatternVariables(lVal);

        case "ObjectPattern":
            return getObjectPatternVariables(lVal);

        case "MemberExpression":
            return [getMemberExperssionVariables(lVal)];

        default:
            return [];
    }
}

function getAssignmentPatternVariables(
    assignmentPattern: AssignmentPattern
): string[] {
    const left = assignmentPattern.left;
    switch (left.type) {
        case "Identifier":
            return [left.name];
        default:
            return [];
    }
}

function getArrayPatternVariables(arrayPattern: ArrayPattern): string[] {
    const res: string[] = [];
    arrayPattern.elements.forEach((element) => {
        if (!element) {
            return;
        }
        res.push(...getLValVariables(element));
    });
    return res;
}

function getObjectPatternVariables(objectPattern: ObjectPattern): string[] {
    const res: string[] = [];
    objectPattern.properties.forEach((property) => {
        if (property.type === "RestElement") {
            res.push(...getLValVariables(property));
        }

        if (property.type === "ObjectProperty") {
            switch (property.value.type) {
                case "Identifier":
                case "RestElement":
                case "AssignmentPattern":
                case "ArrayPattern":
                case "ObjectPattern":
                    res.push(...getLValVariables(property.value));
                    break;
            }
        }
    });
    return res;
}

function getExpressionVariables(expression: Expression): string[] {
    switch (expression.type) {
        case "Identifier":
            return [expression.name];

        case "AssignmentExpression":
            return getLValVariables(expression.left);

        case "UpdateExpression":
            return getExpressionVariables(expression.argument);

        case "MemberExpression":
            return [getMemberExperssionVariables(expression)];

        default:
            return [];
    }
}

// a.b[c]形式的语法识别
function getMemberExperssionVariables(
    memberExperssion: MemberExpression,
    suf: string = ""
) {
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
        return getMemberExperssionVariables(object, newSuf);
    }
}
