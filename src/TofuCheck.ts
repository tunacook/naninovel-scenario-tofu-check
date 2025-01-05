import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core'

function readContent(fullPath: string) {
    const stats = fs.statSync(fullPath);
    // TODO: coreでない方法でログを出す

    if (stats.isFile()) {
        // (A) ファイルなら1つだけ読む
        core.info(`'${fullPath}' is a file, reading content...`);
        const content = fs.readFileSync(fullPath, 'utf-8');
        core.info(`[File: ${fullPath}]`);
        core.info(content);
    } else if (stats.isDirectory()) {
        // (B) ディレクトリなら中のファイルすべてを読む
        core.info(`'${fullPath}' is a directory, reading all files...`);
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });

        for (const entry of entries) {
            // ディレクトリの中の各エントリ
            if (entry.isFile()) {
                const filePath = path.join(fullPath, entry.name);
                const content = fs.readFileSync(filePath, 'utf-8');
                core.info(`[File: ${path.join(fullPath, entry.name)}]`);
                core.info(content);
            }
        }
    } else {
        // シンボリックリンク・特殊ファイルなどはここにくる
        core.warning(`'${fullPath}' is neither a regular file nor a directory.`);
    }
}

export function doTofuCheck(
    charactersFilePath: string,
    scenarioFileDirectoryPath: string
): string {
    const workspace = process.env.GITHUB_WORKSPACE || '';
    const charactersFileFullPath = path.join(workspace, charactersFilePath);
    // const scenarioFileDirectoryFullPath = path.join(workspace, scenarioFileDirectoryPath);

    // 2. ファイル or ディレクトリかチェック

    readContent(charactersFileFullPath);


    return `doTofuCheck charactersFilePath:${charactersFilePath} scenarioFileDirectoryPath:${scenarioFileDirectoryPath} `;
}
