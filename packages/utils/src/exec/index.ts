import path from 'path'
import { pathToFileURL } from 'url'
import log from '~utils/log/index.js'
import { Package } from '~utils/package'

const CACHE_DIR = '.lecuil_cli_cache'

export const exec = async (...args: unknown[]) => {
  let targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH || ''
  let storePath = ''
  let pkg = null
  log.verbose('targetPath', targetPath)
  log.verbose('storePath', homePath)

  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR)
    storePath = path.resolve(targetPath, 'node_modules')

    pkg = new Package({
      targetPath,
      storePath,
      name: '@lecuil-cli/core',
      version: 'latest',
    })

    const isExist = await pkg.exists()

    if (isExist) {
      log.verbose('exec', '更新')
      await pkg.update()
    } else {
      log.verbose('exec', '安装')
      await pkg.install()
    }
    const mainUrl = await pkg.getRootPath()
    log.verbose('mainUrl', mainUrl)
  } else {
    pkg = new Package({
      targetPath,
      name: '@lecuil-cli/core',
      version: 'latest',
    })
  }
  const rootFile = await pkg.getRootPath()
  log.verbose('rootFile', rootFile)
  if (!rootFile) return
  const fn = await import(pathToFileURL(rootFile).href)

  if (fn) {
    fn.default(...args)
  }
}
