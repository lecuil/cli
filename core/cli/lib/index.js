'use strict'

import constant from './constant.js'
import semver from 'semver'
import colors from 'colors'
import log from '@lecuil-cli/log'
import rootCheck from 'root-check'
import { homedir } from 'os'
import { existsSync } from 'fs'
import minimist from 'minimist'

const pkg = await import('../package.json', { with: { type: 'json' } })

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
  const userHome = homedir()
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

const core = () => {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
  } catch (e) {
    log.error(e.message)
  }
}

export default core
