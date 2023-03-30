import * as vscode from "vscode";
import { insertConsole } from "./command/insertConsole";
import { deleteConsole } from "./command/deleteConsole";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "qkConsole.insertConsole",
            insertConsole
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "qkConsole.deleteConsole",
            deleteConsole
        )
    );
}
