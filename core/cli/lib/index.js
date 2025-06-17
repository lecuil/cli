'use strict'

import constant from './constant.js'
import semver from 'semver'
import colors from 'colors'
import log from '@lecuil-cli/log'

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

const core = () => {
  try {
    checkPkgVersion()
    checkNodeVersion()
  } catch (e) {
    log.error(e.message)
  }
}

export default core
