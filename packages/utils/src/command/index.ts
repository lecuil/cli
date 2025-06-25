import type { CommandOptions } from './type'
import colors from 'colors'
import semver from 'semver'
import log from '~utils/log'
import { Command as CommandType } from 'commander'

const LOWEST_NODE_VERSION = '20.0.0'

export * from './type'

export class Command {
  _cmd: CommandType | null
  _name: string
  _options: Record<string, unknown>

  constructor(args: CommandOptions) {
    if (!args) throw new Error('args is required')
    if (!Array.isArray(args)) throw new Error('args must be an array')
    const [name, options, cmd] = args
    if (!name) throw new Error('name is required')
    if (!options) throw new Error('options is required')
    if (!cmd) throw new Error('cmd is required')

    this._name = name
    this._options = options
    this._cmd = cmd

    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve()
      chain.then(() => this.checkNodeVersion())
      chain.then(() => this.init())
      chain.then(() => this.exec())
      chain.catch((err) => {
        log.error('Err', err.message)
      })
    })
    this._cmd = null
  }

  checkNodeVersion() {
    const curVersion = process.version
    const lowestVersion = LOWEST_NODE_VERSION
    if (!semver.gte(curVersion, lowestVersion)) {
      throw new Error(colors.red(`lecuil-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
    }
  }

  init() {
    throw new Error('init method must be implemented')
  }

  exec() {
    throw new Error('exec method must be implemented')
  }
}
