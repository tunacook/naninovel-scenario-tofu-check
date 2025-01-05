import * as core from '@actions/core'
import {hello} from './hello'

function run(): void {
  try {
    const name: string = core.getInput('name')
    const helloMessage: string = hello(name)

    core.info(helloMessage)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
