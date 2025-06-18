import { init } from '@lecuil-cli/init'
import { log } from '@lecuil-cli/utils'
import colors from 'colors'
import { Command } from 'commander'
import { prepare } from './prepare.js'

const pkg = (await import('../package.json', { with: { type: 'json' } })).default

const program = new Command()

/**
 * 注册命令
 */
const registerCommand = () => {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '启用调试模式', false)
    .option('--tp, --targetPath <targetPath>', '是否指定本地文件路径', '')

  program.command('init [projectName]').option('-f, --force', '是否初始化项目').action(init)

  program.on('option:debug', () => {
    process.env.LOG_LEVEL = 'verbose'
    log.level = process.env.LOG_LEVEL
  })

  program.on('option:targetPath', (val) => {
    process.env.CLI_TARGET_PATH = val
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
    prepare()
    registerCommand()
  } catch (e) {
    log.error(e.message)
  }
}

export default core
