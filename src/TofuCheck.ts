import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import {
  isSkipNaninovelSyntax,
  trimAuthor,
  isExtNani,
  trimRuby,
  trimBracket,
  trimSquareBrackets,
} from 'naninovel-script-spec'

interface checkResult {
  isAllIncluded: boolean
  missingChars: string[]
}

export function checkByLine(lines: string[], fileName: string, characterContent: string): checkResult {
  const missingChars: string[] = []
  for (const line of lines) {
    if (!line) continue
    if (isSkipNaninovelSyntax(line)) continue
    const trimLine = trimRuby(trimBracket(trimSquareBrackets(trimAuthor(line))))
    core.info(trimLine)
    for (const char of [...trimLine]) {
      if (missingChars.includes(char)) continue
      if (!characterContent.includes(char)) {
        missingChars.push(char)
      }
    }
  }
  if (missingChars.length > 0) {
    for (const missingChar of missingChars) {
      core.error(`ERROR: '${missingChar}' is not found in characterContent by ${fileName}`)
    }
    throw new Error(`ERROR: Not found characters:\n ${missingChars.join(' / ')}`)
  }
  return {
    isAllIncluded: missingChars.length === 0,
    missingChars,
  }
}

function checkScenarioContent(fullPath: string, characterContent: string): Array<string> {
  const stats = fs.statSync(fullPath)
  // TODO: coreでない方法でログを出す

  if (stats.isFile()) {
    if (!isExtNani(fullPath)) return []
    // ファイルなら1つだけ読む
    core.info(`'${fullPath}' is a file, reading content...`)
    checkByLine(fs.readFileSync(fullPath, 'utf-8').split(/\r?\n/), fullPath, characterContent)
  } else if (stats.isDirectory()) {
    // ディレクトリなら中のファイルすべてを読む
    core.info(`'${fullPath}' is a directory, reading all files...`)
    const entries = fs.readdirSync(fullPath, { withFileTypes: true })
    for (const entry of entries) {
      const filePath = path.join(fullPath, entry.name)
      if (entry.isDirectory()) {
        // ディレクトリの場合は再帰呼び出し
        core.info(`${filePath}' is a directory, reading all files...`)
        checkScenarioContent(filePath, characterContent)
      } else if (entry.isFile()) {
        if (!isExtNani(filePath)) continue
        core.info(`${filePath}' is a directory, reading all files...`)
        checkByLine(fs.readFileSync(filePath, 'utf-8').split(/\r?\n/), filePath, characterContent)
      }
    }
  } else {
    // シンボリックリンク・特殊ファイルなどはここにくる
    core.warning(`'${fullPath}' is neither a regular file nor a directory.`)
  }
  return []
}

function readCharacterContent(fullPath: string): string {
  const stats = fs.statSync(fullPath)
  // TODO: coreでない方法でログを出す
  // TODO: 特定の拡張子だけ読む

  if (stats.isDirectory()) {
    core.error('Specify file paths, not directories')
    return ''
  }

  if (stats.isFile()) {
    // (A) ファイルなら1つだけ読む
    core.info(`'${fullPath}' is a file, reading content...`)
    const content = fs.readFileSync(fullPath, 'utf-8')
    core.info(content)
    return content
  } else {
    // シンボリックリンク・特殊ファイルなど
    core.warning(`'${fullPath}' is neither a regular file nor a directory.`)
    return ''
  }
}

/**
 * Unicode範囲から文字列を生成する
 * @param unicodeRangeHex "20-7E,3040-309F,30A0-30FF" 形式のUnicode範囲指定
 * @returns 範囲内のすべての文字を含む文字列
 */
function generateCharacterContentFromUnicodeRange(unicodeRangeHex: string): string {
  const ranges = unicodeRangeHex.split(',')
  let characters = ''

  for (const range of ranges) {
    const trimmedRange = range.trim()
    if (trimmedRange.includes('-')) {
      // 範囲指定 (例: 20-7E)
      const parts = trimmedRange.split('-')

      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        core.warning(`Invalid Unicode range format: ${trimmedRange}. Expected format: START-END`)
        continue
      }

      const startHex = parts[0].trim()
      const endHex = parts[1].trim()
      const start = parseInt(startHex, 16)
      const end = parseInt(endHex, 16)
      if (isNaN(start) || isNaN(end)) {
        core.warning(`Invalid hexadecimal values in range: ${trimmedRange}`)
        continue
      }
      if (start > end) {
        core.warning(`Invalid range: start (${startHex}) is greater than end (${endHex})`)
        continue
      }

      core.info(`Processing Unicode range: U+${startHex.toUpperCase()} - U+${endHex.toUpperCase()} (${start} - ${end})`)

      for (let codePoint = start; codePoint <= end; codePoint++) {
        characters += String.fromCharCode(codePoint)
      }
    } else {
      // 単一文字指定 (例: 3042)
      const codePoint = parseInt(trimmedRange, 16)
      if (isNaN(codePoint)) {
        core.warning(`Invalid hexadecimal value: ${trimmedRange}`)
        continue
      }
      core.info(`Processing single Unicode: U+${trimmedRange.toUpperCase()} (${codePoint})`)
      characters += String.fromCharCode(codePoint)
    }
  }

  core.info(`Generated ${characters.length} characters from Unicode ranges`)
  return characters
}

export function doTofuCheck(
  charactersFilePath: string,
  unicodeRangeHex: string,
  scenarioFileDirectoryPath: string,
): string {
  const workspace = process.env.GITHUB_WORKSPACE || ''
  const scenarioFileDirectoryFullPath = path.join(workspace, scenarioFileDirectoryPath)

  let characterContent: string
  if (charactersFilePath) {
    // ファイルから読み込み
    const charactersFileFullPath = path.join(workspace, charactersFilePath)
    characterContent = readCharacterContent(charactersFileFullPath)
    core.info('Using characters from file')
  } else {
    // Unicode範囲から生成
    characterContent = generateCharacterContentFromUnicodeRange(unicodeRangeHex)
    core.info('Using characters from Unicode range')
  }

  checkScenarioContent(scenarioFileDirectoryFullPath, characterContent)

  // TODO: 結果をスタックしてまとめてresultとして出すようにする

  return `doTofuCheck charactersFilePath:${charactersFilePath} unicodeRangeHex:${unicodeRangeHex} scenarioFileDirectoryPath:${scenarioFileDirectoryPath} `
}
