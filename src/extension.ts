import * as vscode from "vscode";
import { insertConsole } from "./command/insertConsole";
import { deleteConsole } from "./command/deleteConsole";
import catchParseError from "./utils/catchParseError";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "qkConsole.insertConsole",
            catchParseError(insertConsole)
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "qkConsole.deleteConsole",
            catchParseError(deleteConsole)
        )
    );
}
