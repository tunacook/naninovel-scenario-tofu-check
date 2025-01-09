import * as path from 'path'

const ALLOWED_EXTENSIONS = ['.nani']

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
  return ALLOWED_EXTENSIONS.includes(path.extname(fullPath).toLowerCase())
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

export function trimBracket(line: string): string {
  return line.replace(/<[^>]*>/g, '')
}

export function trimSquareBrackets(line: string): string {
  // /\[.*?\]/g は、[ から始まり ] で終わるまでのあらゆる文字列を
  // 「非貪欲（最短マッチ）*?」で検索し、見つかった部分を一括で削除します
  return line.replace(/\[.*?\]/g, '')
}

export function trimRuby(line: string): string {
  // 正規表現で <ruby="...">...</ruby> を検出
  // キャプチャ:
  //   group1 -> ルビ ("・"など)
  //   group2 -> タグ内の文字 ("彼"など)
  const regex = /<ruby="([^"]*)">(.*?)<\/ruby>/g

  // 置換ロジック:
  //   - group2(ベース文字) + 改行 + group1(ルビ)
  return line.replace(regex, (_match, rubyValue, baseText) => {
    // 好みに応じて結合の仕方を変えてOK
    // ここでは改行区切りにしている
    return `${baseText}${rubyValue}`
  })
}

/**
 * Naninovelの構文であるかどうか Naninovel構文であればスキップする
 */
export function isSkipNaninovelSyntax(line: string): boolean {
  if (isCommandLine(line)) return true
  if (isCommentLine(line)) return true
  return isLabelLine(line)
}
