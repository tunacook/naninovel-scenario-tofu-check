import * as core from '@actions/core'
import { doTofuCheck } from './TofuCheck'

function run(): void {
  try {
    const charactersFilePath: string = core.getInput('charactersFilePath')
    const unicodeRangeHex: string = core.getInput('unicodeRangeHex')
    const scenarioFileDirectoryPath: string = core.getInput('scenarioFileDirectoryPath')

    // どちらか一つが指定されているかチェック
    if (!charactersFilePath && !unicodeRangeHex) {
      throw new Error('charactersFilePathまたはunicodeRangeHexのどちらか一つを指定してください')
    }

    // 両方指定されていないかチェック
    if (charactersFilePath && unicodeRangeHex) {
      throw new Error('charactersFilePathとunicodeRangeHexは両立できません。どちらか一つを指定してください')
    }

    const doMessage: string = doTofuCheck(charactersFilePath, unicodeRangeHex, scenarioFileDirectoryPath)
    core.info(doMessage)
  } catch (e) {
    if (e instanceof Error) core.setFailed(e.message)
  }
}

run()
