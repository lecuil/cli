import log from '../log/index.js'
import { Package } from '../package/index.js'

export const exec = () => {
  const targetPath = process.env.CLI_TARGET_PATH
  const storePath = process.env.CLI_HOME_PATH
  log.verbose('targetPath', targetPath)
  log.verbose('storePath', storePath)

  const pkg = new Package({
    targetPath,
    storePath,
    name: '@lecuil-cli/init',
    version: 'latest',
  })
  console.log(pkg, 'pkg')
}
