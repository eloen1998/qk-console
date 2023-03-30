import { window, Range } from "vscode";
import { getConsoleRange } from "../handler";

export const deleteConsole = () => {
    const editor = window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const documentText = editor.document.getText();
    const languageType = document.languageId;
    if (!languageType) {
        return;
    }
    const rangeList = getConsoleRange(documentText, languageType);

    editor.edit((textEditorEdit) => {
        rangeList.forEach((consoleRange) => {
            const [start, end] = consoleRange.range;
            textEditorEdit.delete(getVscodeRange(start, end));
        });
    });

    function getVscodeRange(startOffset: number, endOffset: number) {
        const consoleStartPosition = document.positionAt(startOffset);
        const consoleEndPosition = document.positionAt(endOffset);

        let wholeRange = new Range(consoleStartPosition, consoleEndPosition);

        const startLine = document.lineAt(consoleStartPosition.line);
        const endLine = document.lineAt(consoleEndPosition.line);

        const lineStartWithConsole =
            startLine.firstNonWhitespaceCharacterIndex ===
            consoleStartPosition.character;
        const lineEndWithConsole =
            endLine.firstNonWhitespaceCharacterIndex +
                endLine.text.trim().length ===
            consoleEndPosition.character;

        // 只有console所在所有行都不包括任何其他元素时，删掉换行符
        if (lineStartWithConsole && lineEndWithConsole) {
            wholeRange = wholeRange.union(startLine.range);
            wholeRange = wholeRange.union(endLine.rangeIncludingLineBreak);
        }
        return wholeRange;
    }
};
