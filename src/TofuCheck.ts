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

export function doTofuCheck(charactersFilePath: string, scenarioFileDirectoryPath: string): string {
  const workspace = process.env.GITHUB_WORKSPACE || ''
  const charactersFileFullPath = path.join(workspace, charactersFilePath)
  const scenarioFileDirectoryFullPath = path.join(workspace, scenarioFileDirectoryPath)

  const characterContent = readCharacterContent(charactersFileFullPath)
  checkScenarioContent(scenarioFileDirectoryFullPath, characterContent)

  // TODO: 結果をスタックしてまとめてresultとして出すようにする

  return `doTofuCheck charactersFilePath:${charactersFilePath} scenarioFileDirectoryPath:${scenarioFileDirectoryPath} `
}
