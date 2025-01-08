import * as path from 'path';

const ALLOWED_EXTENSIONS = [".nani"];

// https://naninovel.com/ja/guide/naninovel-scripts

/**
 * Naninovelのラベル構文であるかどうか
 * @param line
 */
function isLabelLine(line: string): boolean {
  return line.trimStart().startsWith('#')
}

/**
 * Naninovelのスクリプト構文であるかどうか
 * @param line
 */
function isCommandLine(line: string): boolean {
  return line.trimStart().startsWith('@')
}

/**
 * Naninovelのコメント構文であるかどうか
 * @param line
 */
function isCommentLine(line: string): boolean {
  return line.trimStart().startsWith(';')
}

export function isExtNani(fullPath: string): boolean {
  return ALLOWED_EXTENSIONS.includes(
    path.extname(fullPath).toLowerCase()
  );
}

/**
 * セリフ構文の場合に話者IDを除外してセリフ文章だけを返す セリフ構文でない場合はなにもしない
 * @param line
 */
export function trimAuthor(line: string): string {
  const colonIndex = line.indexOf(':')
  if (colonIndex === -1) return line
  return line.slice(colonIndex + 1).trim()
}

/**
 * Naninovelの構文であるかどうか Naninovel構文であればスキップする
 */
export function isSkipNaninovelSyntax(line: string): boolean {
  if (isCommandLine(line)) return true
  if (isCommentLine(line)) return true
  return isLabelLine(line)
}
