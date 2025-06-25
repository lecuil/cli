import path from 'path'
import { pathToFileURL } from 'url'
import log from '~utils/log/index.js'
import { Package } from '~utils/package'
import cp from 'child_process'
import type { CommandOptions } from '~utils/command'
import type { Command } from 'commander'

const CACHE_DIR = '.lecuil_cli_cache'

export const exec = async (...args: CommandOptions) => {
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
  if (!rootFile) return log.error('执行失败', '模块不存在')

  const cmd = args[args.length - 1] as Command
  const o = Object.create(null)
  Object.keys(cmd).forEach((key) => {
    if (cmd.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
      o[key] = (cmd as any)[key]
    }
  })
  args[args.length - 1] = o

  try {
    const code = `
      import { pathToFileURL } from 'url';
      const fn = await import(pathToFileURL('${rootFile}').href);
      if (!fn || !fn.default) {
        console.error('Err', '模块不存在');
        process.exit(1);
      }
      await fn.default(${JSON.stringify(args)});
    `
    const child = cp.spawn('node', ['--input-type=module', '-e', code], {
      cwd: process.cwd(),
      stdio: 'inherit',
    })
    child.stdout?.on('error', (e) => {
      log.error('执行失败·', e.message)
      process.exit(1)
    })
    child.stderr?.on('exit', (e) => {
      log.verbose('命令执行成功', e)
      process.exit(0)
    })
  } catch (e) {
    log.error('执行失败', (e as Error).message)
  }
}

const spawn = (command: string, args: string[], options: cp.SpawnOptions) => {
  const win32 = process.platform === 'win32'

  const cmd = win32 ? 'cmd' : command
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args
  return cp.spawn(cmd, cmdArgs, options)
}
