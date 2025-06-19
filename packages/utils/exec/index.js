import log from '../log/index.js'
import { Package } from '../package/index.js'

export const exec = async () => {
  const targetPath = process.env.CLI_TARGET_PATH
  const storePath = process.env.CLI_HOME_PATH
  log.verbose('targetPath', targetPath)
  log.verbose('storePath', storePath)

  if (!targetPath) {
    // 生成缓存路径
  }

  const pkg = new Package({
    targetPath,
    storePath,
    name: '@lecuil-cli/init',
    version: 'latest',
  })
  const mainUrl = await pkg.getRootPath()
  console.log(mainUrl, 'mainUrl')
}
