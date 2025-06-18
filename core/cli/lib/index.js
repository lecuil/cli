'use strict'

import { getNpmSemverVersions, log } from '@lecuil-cli/utils'
import colors from 'colors'
import { Command } from 'commander'
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import minimist from 'minimist'
import { homedir } from 'os'
import path from 'path'
import rootCheck from 'root-check'
import semver from 'semver'
import constant from './constant.js'
import { init } from '@lecuil-cli/init'

const pkg = (await import('../package.json', { with: { type: 'json' } })).default
const userHome = homedir()
const { DEFAULT_CLI_HOME } = constant

const program = new Command()

const checkPkgVersion = () => {
  log.info('cli', pkg.version)
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

const checkGlobalUpdate = async () => {
  const curVersion = pkg.version
  const npmName = pkg.name
  const newVersion = await getNpmSemverVersions(curVersion, npmName)
  if (newVersion && semver.gt(newVersion, curVersion)) {
    log.warn(colors.yellow(`当前版本为 ${curVersion}, 最新版本为 ${newVersion}`))
  }
}

const registerCommand = () => {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '启用调试模式', false)

  program.command('init [projectName]').option('-f, --force', '是否初始化项目').action(init)

  program.on('option:debug', () => {
    process.env.LOG_LEVEL = 'verbose'
    log.level = process.env.LOG_LEVEL
  })

  program.on('command:*', (obj) => {
    const availableCommands = program.commands.map((cmd) => cmd.name())
    console.log(colors.red(`未知命令：${obj[0]}`))
    if (availableCommands.length > 0) {
      console.log(colors.green(`可用命令：${availableCommands.join(',')}`))
    }
  })

  program.parse(process.argv)

  if (program.args && program.args.length < 1) {
    program.outputHelp()
    console.log()
  }
}

const core = async () => {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    // checkInputArgs()
    checkEnv()
    await checkGlobalUpdate()
    registerCommand()
  } catch (e) {
    log.error(e.message)
  }
}

export default core
