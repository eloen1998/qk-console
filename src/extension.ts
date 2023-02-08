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

            const { selection } = editor;
            const selectVariable = editor.document.getText(selection);

            if (selectVariable) {
                snippet = consoleFormatter(selectVariable);
            } else {
                let curPos = editor.selection.active;
                let offset = editor.document.offsetAt(curPos);

                const languageType =
                    vscode.window.activeTextEditor?.document.languageId;

                if (!languageType) {
                    return;
                }
                const consoleVariable = getVariable(
                    editor.document.getText(),
                    offset,
                    languageType
                );
                snippet = consoleFormatter(consoleVariable);
            }

            vscode.commands
                .executeCommand("editor.action.insertLineAfter")
                .then(() => {
                    vscode.commands.executeCommand(
                        "editor.action.insertSnippet",
                        {
                            snippet,
                        }
                    );
                });
        }
    );

    context.subscriptions.push(qkConsole);
}
