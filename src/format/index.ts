import type { ConsoleVariable } from "../types";

// "myConsole.log('${1:" + text + "}', $1);$0",

export function consoleFormatter(params: ConsoleVariable | string): string {
    if (typeof params === "string") {
        return `console.log("${params}", ${params})`;
    }
    const { funcName, variables } = params;
    let content = "";
    if (funcName) {
        content += `"${funcName}"`;
        if (variables) {
            content += ", ";
            if (variables instanceof Array) {
                content += variables.join(",");
            } else {
                content += variables;
            }
        }
    } else if (variables) {
        if (variables instanceof Array) {
            content += variables
                .map((variable) => `"${variable}", ${variable}`)
                .join(", ");
        } else {
            content += `"${variables}", ${variables}`;
        }
    }

    return `console.log(${content})`;
}
