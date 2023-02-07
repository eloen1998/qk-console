import * as vscode from "vscode";

import { getVariable } from "./nodeHanlers";
import { consoleFormatter } from "./format";

export function activate(context: vscode.ExtensionContext) {
    const qkConsole = vscode.commands.registerCommand("qkConsole.insertConsole", () => {
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
            const consoleVariable = getVariable(
                editor.document.getText(),
                offset
            );
            snippet = consoleFormatter(consoleVariable);
        }

        vscode.commands
            .executeCommand("editor.action.insertLineAfter")
            .then(() => {
                vscode.commands.executeCommand("editor.action.insertSnippet", {
                    snippet,
                });
            });
    });

    context.subscriptions.push(qkConsole);
}
