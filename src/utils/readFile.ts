import fs from "fs";

export default function (filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (error, data) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            resolve(data);
        });
    });
}
