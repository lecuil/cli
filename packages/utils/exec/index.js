import path from 'path'
import log from '../log/index.js'
import { Package } from '../package/index.js'
import { pathToFileURL } from 'url'

const CACHE_DIR = '.lecuil_cli_cache'

export const exec = async (...args) => {
  let targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH
  let storePath = ''
  let pkg = null
  log.verbose('targetPath', targetPath)
  log.verbose('storePath', homePath)

  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR)
    storePath = path.resolve(targetPath, 'node_modules')
    log.verbose('targetPath', targetPath)
    log.verbose('storePath', storePath)

    pkg = new Package({
      targetPath,
      storePath,
      name: '@lecuil-cli/init',
      version: 'latest',
    })

    if (pkg.exists()) {
      pkg.update()
    } else {
      await pkg.install()
    }
    const mainUrl = await pkg.getRootPath()
    console.log(mainUrl, 'mainUrl')
  } else {
    pkg = new Package({
      targetPath,
      name: '@lecuil-cli/init',
      version: 'latest',
    })

    const rootFile = await pkg.getRootPath()
    log.verbose('rootFile', rootFile)
    const fn = await import(pathToFileURL(rootFile).href)
    if (fn) {
      fn.default(...args)
    }
  }
}
