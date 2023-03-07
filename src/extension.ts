import * as vscode from "vscode";

import { getVariable } from "./handler";
import { consoleFormatter } from "./format";

export function activate(context: vscode.ExtensionContext) {
    const qkConsole = vscode.commands.registerCommand(
        "qkConsole.insertConsole",
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }

            let snippet: string;

            const { document, selection } = editor;
            const curPos = selection.active;
            const selectVariable = document.getText(selection);

            const textLine = document.lineAt(curPos);
            const emptyLine = textLine.isEmptyOrWhitespace;

            if (selectVariable) {
                snippet = consoleFormatter(selectVariable);
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
            const snippetString = new vscode.SnippetString(snippet);

            if (emptyLine) {
                editor.insertSnippet(snippetString);
                return;
            }

            vscode.commands
                .executeCommand("editor.action.insertLineAfter")
                .then(() => {
                    vscode.commands.executeCommand(
                        "editor.action.insertSnippet",
                        {
                            snippetString,
                        }
                    );
                });
        }
    );

    context.subscriptions.push(qkConsole);
}
