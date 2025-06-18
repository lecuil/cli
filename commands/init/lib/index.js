'use strict'

export const init = (projectName, _, cmdObj) => {
  const options = cmdObj.parent.opts()
  console.log('init', projectName, options, process.env.CLI_TARGET_PATH)
}
