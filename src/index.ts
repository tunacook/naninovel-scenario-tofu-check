import * as core from '@actions/core'
import {doTofuCheck} from './TofuCheck'

function run(): void {
  try {
    const charactersFilePath: string = core.getInput('charactersFilePath')
    const scenarioFileDirectoryPath: string = core.getInput('scenarioFileDirectoryPath')
    const doMessage: string = doTofuCheck(charactersFilePath, scenarioFileDirectoryPath)




    core.info(doMessage)
  } catch (e) {
    if (e instanceof Error) core.setFailed(e.message)
  }
}

run()
