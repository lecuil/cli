import type { Command } from 'commander'

const init = (projectName: string, _: unknown, cmdObj: Command) => {
  const options = cmdObj.parent!.opts()
  console.log('init', projectName, options, process.env.CLI_TARGET_PATH)
}

export default init
