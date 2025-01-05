import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core'


// シナリオファイルを1行ずつ読み込む
// 行に対して

interface checkResult {
    isAllIncluded: boolean
    missingChars: string[]
}

export function checkByLine(lines: string[], fileName:string, characterContent: string): checkResult {
    const missingChars: string[] = [];
    for (const line of lines) {
        if (!line) continue;

        // TODO: コメント、スクリプト部分はスキップする
        // TODO: ローカライズ対応、IDをスキップする https://naninovel.com/ja/guide/localization#%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%A9%E3%82%A4%E3%82%B9%E3%82%99

        for (const char of [...line]) {
            if (missingChars.includes(char)) continue;
            if (!characterContent.includes(char)) {
                missingChars.push(char);
            }
        }
    }
    for (const missingChar of missingChars) {
        core.error(`ERROR: '${missingChar}' is not found in ${fileName}`);
    }
    return {
        isAllIncluded: missingChars.length === 0,
        missingChars,
    }
}

function checkScenarioContent(fullPath: string, characterContent: string):Array<string> {
    const stats = fs.statSync(fullPath);
    // TODO: coreでない方法でログを出す

    if (stats.isFile()) {
        // ファイルなら1つだけ読む
        core.info(`'${fullPath}' is a file, reading content...`);
        checkByLine(
            fs.readFileSync(fullPath, 'utf-8').split(/\r?\n/),
            fullPath,
            characterContent
        );
    } else if (stats.isDirectory()) {
        // ディレクトリなら中のファイルすべてを読む
        core.info(`'${fullPath}' is a directory, reading all files...`);
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        for (const entry of entries) {
            // ディレクトリの中の各エントリ
            if (entry.isFile()) {
                const filePath = path.join(fullPath, entry.name);
                // const content = fs.readFileSync(filePath, 'utf-8');
                // core.info(`[File: ${path.join(fullPath, entry.name)}]`);
                // core.info(content);
                checkByLine(
                    fs.readFileSync(filePath, 'utf-8').split(/\r?\n/),
                    filePath,
                    characterContent
                );
            }
        }
    } else {
        // シンボリックリンク・特殊ファイルなどはここにくる
        core.warning(`'${fullPath}' is neither a regular file nor a directory.`);
    }
    return [];
}

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

    const characterContent = readCharacterContent(charactersFileFullPath);
    checkScenarioContent(scenarioFileDirectoryFullPath, characterContent);

    // TODO: 結果をスタックしてまとめてresultとして出すようにする

    return `doTofuCheck charactersFilePath:${charactersFilePath} scenarioFileDirectoryPath:${scenarioFileDirectoryPath} `;
}
