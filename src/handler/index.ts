import { getVariableJs, getConsoleRangeJs } from "./handleJs";
import { getVariableVue, getConsoleRangeVue } from "./handleVue";

export function getVariable(code: string, index: number, type: string) {
    if (type === "vue") {
        return getVariableVue(code, index);
    } else {
        return getVariableJs(code, index);
    }
}

export function getConsoleRange(code: string, type: string) {
    if (type === "vue") {
        return getConsoleRangeVue(code);
    } else {
        return getConsoleRangeJs(code);
    }
}
