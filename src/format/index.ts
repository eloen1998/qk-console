import { SnippetString } from "vscode";

export function consoleFormatter(
    params: ConsoleVariable | string
): SnippetString {
    if (typeof params === "string") {
        return new SnippetString(`console.log('${params}', ${params});`);
    }
    const { funcName, variables } = params;
    let content = "";
    if (funcName) {
        content += `'${funcName}'`;
        if (variables && variables.length) {
            content += ", ";
            if (variables instanceof Array) {
                content += variables.join(", ");
            } else {
                content += variables;
            }
        }
    } else if (variables) {
        if (variables instanceof Array) {
            content += variables
                .map((variable) => `'${variable}', ${variable}`)
                .join(", ");
        } else {
            content += `'${variables}', ${variables}`;
        }
    }

    return new SnippetString(`console.log(${content});`);
}
