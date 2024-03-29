import { window, Range } from "vscode";
import { getConsoleRange } from "../handler";
import { getSetting } from "../utils/setting";

const DELETE_CONSOLE_TYPE_LIST = getSetting<string[]>("delete.types");

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


    if (!rangeList.length) {
        window.showInformationMessage("没有找到console语句");
        return;
    }

    const toDeleteRange = rangeList.filter((range) =>
        DELETE_CONSOLE_TYPE_LIST.includes(range.name)
    );

    if (!toDeleteRange.length) {
        window.showInformationMessage("没有找到需要删除的console语句，可通过\"qkConsole.delete.types\"配置需要删除的console类型");
        return;
    }

    editor.edit((textEditorEdit) => {
        toDeleteRange.forEach((consoleRange) => {
            const [start, end] = consoleRange.range;
            textEditorEdit.delete(getVscodeRange(start, end));
        });
    });

    showDeleteInfo(toDeleteRange);

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

function showDeleteInfo(consoleList: ConsoleRange[]) {
    const NumMap: { [key: string]: number } = {};
    consoleList.forEach((console) => {
        if (NumMap[console.name]) {
            NumMap[console.name]++;
        } else {
            NumMap[console.name] = 1;
        }
    });

    const detailInfo = Object.entries(NumMap)
        .map((item) => {
            const [logType, logNum] = item;
            return `${logNum}条${logType}`;
        })
        .join(", ");
    window.showInformationMessage(
        `总计删除${consoleList.length}条console，包括${detailInfo}。`
    );
}
