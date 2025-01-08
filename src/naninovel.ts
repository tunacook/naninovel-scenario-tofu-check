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

/**
 * セリフ構文の場合に話者IDを除外してセリフ文章だけを返す セリフ構文でない場合はなにもしない
 * @param line
 */
export function trimAuthor(line: string): string {
  const colonIndex = line.indexOf(':')
  if (colonIndex === -1) return line
  return line.slice(colonIndex + 1).trim()
}

// TODO: ローカライズ対応、IDをスキップする https://naninovel.com/ja/guide/localization#%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%A9%E3%82%A4%E3%82%B9%E3%82%99

/**
 * Naninovelの構文であるかどうか Naninovel構文であればスキップする
 */
export function isSkipNaninovelSyntax(line: string): boolean {
  if (isCommandLine(line)) return true
  if (isCommentLine(line)) return true
  return isLabelLine(line)
}
