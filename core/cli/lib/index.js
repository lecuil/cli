'use strict'

import constant from './constant.js'
import semver from 'semver'
import colors from 'colors'
import { log } from '@lecuil-cli/utils'
import rootCheck from 'root-check'
import { homedir } from 'os'
import { existsSync } from 'fs'
import minimist from 'minimist'
import dotenv from 'dotenv'
import path from 'path'

const pkg = await import('../package.json', { with: { type: 'json' } })
const userHome = homedir()
const { DEFAULT_CLI_HOME } = constant

const checkPkgVersion = () => {
  log.info('cli', pkg.default.version)
}

const checkNodeVersion = () => {
  const curVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  if (!semver.gte(curVersion, lowestVersion)) {
    throw new Error(colors.red(`lecuil-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
  }
}

const checkRoot = () => {
  rootCheck(colors.red('请避免使用 root 账户启动本应用'))
}

const checkUserHome = () => {
  if (!userHome || !existsSync(userHome)) {
    throw new Error(colors.red('当前用户主目录不存在'))
  }
}

const checkInputArgs = () => {
  log.verbose('开始校验输入参数')
  const args = minimist(process.argv.slice(2)) // 解析查询参数
  checkArgs(args) // 校验参数
  log.verbose('输入参数', args)
}

const checkArgs = (args) => {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level = process.env.LOG_LEVEL
}

const checkEnv = () => {
  log.verbose('开始检查环境变量')
  const envPath = path.resolve(userHome, '.env')
  dotenv.config({
    path: envPath,
  })
  const config = createCliConfig() // 准备基础配置
  log.verbose('环境变量', config)
}

const createCliConfig = () => {
  const cliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig['cliHome'] = path.join(userHome, DEFAULT_CLI_HOME)
  }
  return cliConfig
}

const core = () => {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkEnv()
  } catch (e) {
    log.error(e.message)
  }
}

export default core
