import { getNpmSemverVersions, log } from '@lecuil-cli/utils'
import colors from 'colors'
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { homedir } from 'os'
import path from 'path'
import rootCheck from 'root-check'
import semver from 'semver'
import constant from './constant.js'

const pkg = (await import('../package.json', { with: { type: 'json' } })).default
const userHome = homedir()
const { DEFAULT_CLI_HOME } = constant

interface CliConfig {
  home: string
  cliHome?: string
}

/**
 * 检查版本
 */
const checkPkgVersion = () => {
  log.info('cli', pkg.version)
}

/**
 * 检查 NodeJS 版本
 */
const checkNodeVersion = () => {
  const curVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  if (!semver.gte(curVersion, lowestVersion)) {
    throw new Error(colors.red(`lecuil-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
  }
}

/**
 * 检查是否使用 root 账户
 */
const checkRoot = () => {
  rootCheck(colors.red('请避免使用 root 账户启动本应用'))
}

/**
 * 检查当前用户主目录是否存在
 */
const checkUserHome = () => {
  if (!userHome || !existsSync(userHome)) {
    throw new Error(colors.red('当前用户主目录不存在'))
  }
}

/**
 * 检查环境变量
 */
const checkEnv = () => {
  const envPath = path.resolve(userHome, '.env')
  dotenv.config({
    path: envPath,
  })
  createDefaultConfig()
}

/**
 * 创建默认配置
 */
const createDefaultConfig = () => {
  const cliConfig: CliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig['cliHome'] = path.join(userHome, DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
}

/**
 * 检查全局更新
 */
const checkGlobalUpdate = async () => {
  const curVersion = pkg.version
  const npmName = pkg.name
  const newVersion = await getNpmSemverVersions(curVersion, npmName)
  if (newVersion && semver.gt(newVersion, curVersion)) {
    log.warn('cli', colors.yellow(`当前版本为 ${curVersion}, 最新版本为 ${newVersion}`))
  }
}

export const prepare = async () => {
  checkPkgVersion()
  checkNodeVersion()
  checkRoot()
  checkUserHome()
  checkEnv()
  await checkGlobalUpdate()
}
