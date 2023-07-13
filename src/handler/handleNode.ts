import {
    LVal,
    Pattern,
    Identifier,
    Expression,
    RestElement,
    ArrayPattern,
    ObjectPattern,
    MemberExpression,
    AssignmentPattern,
    VariableDeclaration
} from "@babel/types";

export function isContain(node, index: number) {
    return index >= node.start && index <= node.end;
}

export function getLValVariables(lVal: LVal): string[] {
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
            return [getMemberExpressionVariables(lVal)];

        default:
            return [];
    }
}

export function getExpressionVariables(expression: Expression): string[] {
    switch (expression.type) {
        case "Identifier":
            return [expression.name];

        case "AssignmentExpression":
            return getLValVariables(expression.left);

        case "UpdateExpression":
            return getExpressionVariables(expression.argument);

        case "MemberExpression":
            return [getMemberExpressionVariables(expression)];

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

export function getParamsVariables(
    params: Array<Identifier | Pattern | RestElement>
): string[] {
    return params.reduce((pre: string[], param) => {
        return pre.concat(getLValVariables(param));
    }, []);
}

export function getVariableDeclarationVariables(
    params: VariableDeclaration
): string[] {
    return params.declarations.reduce(
        (pre: string[], declaration): string[] => {
            return pre.concat(getLValVariables(declaration.id));
        },
        []
    );
}

// a.b[c]形式的语法识别
function getMemberExpressionVariables(
    memberExpression: MemberExpression,
    suf: string = ""
): string {
    let newSuf = "";
    const { property, object } = memberExpression;
    if (property.type === "Identifier") {
        if (memberExpression.computed) {
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
        return getMemberExpressionVariables(object, newSuf);
    }
    return "";
}
