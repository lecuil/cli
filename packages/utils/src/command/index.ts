import type { CommandOptions } from './type'
import colors from 'colors'
import semver from 'semver'
import log from '~utils/log'

const LOWEST_NODE_VERSION = '20.0.0'

export * from './type'

export class Command {
  _args: CommandOptions

  constructor(args: CommandOptions) {
    this._args = args
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve()
      chain.then(() => this.checkNodeVersion())
      chain.catch((err) => {
        log.error('command', err.message)
      })
    })
  }

  checkNodeVersion() {
    const curVersion = process.version
    const lowestVersion = LOWEST_NODE_VERSION
    if (!semver.gte(curVersion, lowestVersion)) {
      throw new Error(colors.red(`lecuil-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
    }
  }

  init() {
    // throw new Error('init method must be implemented')
  }

  exec() {
    // throw new Error('exec method must be implemented')
  }
}
