import { SnippetString } from "vscode";
import { getSetting } from "../utils/setting";

const SEPARATOR = ", ";

export function consoleFormatter(
    params: ConsoleVariable | string
): SnippetString {
    const singleQuote = getSetting<boolean>("singleQuote");
    const semi = getSetting<boolean>("semi");
    const prefix = getSetting<string>("prefix");

    const quote = singleQuote ? "'" : '"';

    const snipStr = new SnippetString("console.log(");
    if (prefix) {
        snipStr.appendText(prefix);
    }
    if (typeof params === "string") {
        formatSingleString(snipStr, params, quote);
    } else {
        formatConsoleVariable(snipStr, params, quote);
    }
    snipStr.appendText(")");
    if (semi) {
        snipStr.appendText(";");
    }
    return snipStr;
}

function formatSingleString(
    snipStr: SnippetString,
    params: string,
    quote: string
) {
    return snipStr
        .appendText(quote)
        .appendPlaceholder(params, 1)
        .appendText(quote)
        .appendText(SEPARATOR)
        .appendPlaceholder(params, 1);
}

function formatConsoleVariable(
    snipStr: SnippetString,
    params: ConsoleVariable,
    quote: string
) {
    const { funcName, variables } = params;
    if (funcName) {
        formatFunction(snipStr, funcName, quote);
        if (variables) {
            formatFunctionParams(snipStr, variables);
        }
    } else if (variables) {
        formatVariables(snipStr, variables, quote);
    }
}

function formatFunction(
    snipStr: SnippetString,
    funcName: string,
    quote: string
) {
    snipStr.appendText(quote).appendPlaceholder(funcName, 1).appendText(quote);
}
function formatFunctionParams(snipStr: SnippetString, variables: string[]) {
    variables.forEach((variable, index) => {
        snipStr.appendText(SEPARATOR).appendPlaceholder(variable, index + 2);
    });
}

function formatVariables(
    snipStr: SnippetString,
    variables: string[],
    quote: string
) {
    variables.forEach((variable, index) => {
        snipStr
            .appendText(quote)
            .appendPlaceholder(variable, index + 1)
            .appendText(quote)
            .appendText(SEPARATOR)
            .appendPlaceholder(variable, index + 1);
        if (index !== variables.length - 1) {
            snipStr.appendText(SEPARATOR);
        }
    });
}
