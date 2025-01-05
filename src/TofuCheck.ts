import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core'


// シナリオファイルを1行ずつ読み込む
// 行に対して


function readCharacterContent(fullPath: string): string {
    const stats = fs.statSync(fullPath);
    // TODO: coreでない方法でログを出す
    // TODO: 特定の拡張子だけ読む

    if (stats.isDirectory()) {
        core.error("Specify file paths, not directories");
        return '';
    }

    if (stats.isFile()) {
        // (A) ファイルなら1つだけ読む
        core.info(`'${fullPath}' is a file, reading content...`);
        const content = fs.readFileSync(fullPath, 'utf-8');
        core.info(content);
        return content;
    } else {
        // シンボリックリンク・特殊ファイルなど
        core.warning(`'${fullPath}' is neither a regular file nor a directory.`);
        return '';
    }
}

export function doTofuCheck(
    charactersFilePath: string,
    scenarioFileDirectoryPath: string
): string {
    const workspace = process.env.GITHUB_WORKSPACE || '';
    const charactersFileFullPath = path.join(workspace, charactersFilePath);
    const scenarioFileDirectoryFullPath = path.join(workspace, scenarioFileDirectoryPath);

    readCharacterContent(charactersFileFullPath);
    // readScenarioContent(scenarioFileDirectoryFullPath);
    return `doTofuCheck charactersFilePath:${charactersFilePath} scenarioFileDirectoryPath:${scenarioFileDirectoryPath} `;
}
