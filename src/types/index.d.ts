export {}

declare global {
    type ConsoleVariable = {
        funcName?: string;
        variables?: string[];
    };
    type ConsoleRange = {
        name: string;
        range: [number, number];
    };
}