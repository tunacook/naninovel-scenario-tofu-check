/**
 * Naninovelのスクリプト構文であるかどうか
 * @param line
 */
function isCommandLine(line: string): boolean {
  return line.trimStart().startsWith('@');
}

/**
 * Naninovelのコメント構文であるかどうか
 * @param line
 */
function isCommentLine(line: string): boolean {
  return line.trimStart().startsWith(';');
}

// TODO: ローカライズ対応、IDをスキップする https://naninovel.com/ja/guide/localization#%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%A9%E3%82%A4%E3%82%B9%E3%82%99

/**
 * Naninovelの構文であるかどうか Naninovel構文であればスキップする
 */
export function isSkipNaninovelSyntax(line: string): boolean {
  if (isCommandLine(line)) return true;
  return isCommentLine(line);
}
