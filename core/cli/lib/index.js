'use strict'

import constant from './constant.js'
import semver from 'semver'
import colors from 'colors'
import log from '@lecuil-cli/log'
import rootCheck from 'root-check'
import { homedir } from 'os'
import { existsSync } from 'fs'

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
  if (userHome || !existsSync(userHome)) {
    throw new Error(colors.red('当前用户主目录不存在'))
  }
}

const core = () => {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
  } catch (e) {
    log.error(e.message)
  }
}

export default core
