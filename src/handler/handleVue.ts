import { parse, compileScript } from "@vue/compiler-sfc";
import { getVariableJs } from "./handleJs";
export function getVariableVue(code: string, index: number) {
    const { descriptor } = parse(code);

    if (!descriptor.scriptSetup && !descriptor.script) {
        // no write scriptSetup and  no write script
        return {};
    }

    const { loc } = compileScript(descriptor, {
        id: "qk-console",
        isProd: false,
        sourceMap: false
    });

    return getVariableJs(loc.source, index - loc.start.offset);
}
