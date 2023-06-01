import { workspace } from "vscode";

type setting_key =
    "singleQuote" |
    "semi" |
    "delete.types" |
    "prefix";


const DEFAULT_SETTING = {
    singleQuote: true,
    semi: true,
    ["delete.types"]: ["log", "time", "timeEnd"],
    prefix: "",
};

export function getSetting<T>(name: setting_key) {
    const defaultValue = DEFAULT_SETTING[name] as T;
    return workspace.getConfiguration("qkConsole").get<T>(name, defaultValue);
}
