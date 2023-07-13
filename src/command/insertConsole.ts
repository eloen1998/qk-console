import * as vscode from "vscode";
import { getVariable } from "../handler";
import { consoleFormatter } from "../format";

export function insertConsole() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    let snippet: vscode.SnippetString;

    const { document, selection } = editor;
    const curPos = selection.active;
    const selectVariable = document.getText(selection);

    const textLine = document.lineAt(curPos);
    const emptyLine = textLine.isEmptyOrWhitespace;

    if (selectVariable) {
        snippet = consoleFormatter(selectVariable.trim());
    } else {
        let offset = document.offsetAt(curPos);
        if (emptyLine) {
            const lineNumber = Math.max(textLine.lineNumber - 1, 0);
            const lastLine = document.lineAt(lineNumber);
            const position = new vscode.Position(
                lineNumber,
                lastLine.firstNonWhitespaceCharacterIndex +
                    lastLine.text.trim().length
            );
            offset = document.offsetAt(position);
        }
        const languageType = document.languageId;
        if (!languageType) {
            return;
        }
        const consoleVariable = getVariable(
            document.getText(),
            offset,
            languageType
        );
        snippet = consoleFormatter(consoleVariable);
    }

    if (emptyLine) {
        editor.insertSnippet(snippet);
        return;
    }

    vscode.commands.executeCommand("editor.action.insertLineAfter").then(() => {
        editor.insertSnippet(snippet);
    });
}
