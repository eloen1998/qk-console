import { window } from "vscode";

export default function (command: Function) {
    return () => {
        try {
            command();
        } catch (error: any) {
            if (error.code === "BABEL_PARSER_SYNTAX_ERROR") {
                window.showWarningMessage("请确保文件的语法正确");
            } else {
                throw error;
            }
        }
    };
}
