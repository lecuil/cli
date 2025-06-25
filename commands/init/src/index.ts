import { Command, type CommandOptions } from '@lecuil-cli/utils'

export class InitCommand extends Command {
  force: boolean = false

  init(): void {
    this.force = Boolean(this._options.force)
  }

  exec(): void {
    // 准备阶段
    // 下载模板
    // 安装模板
  }

  prepare() {}
}

const init = (args: CommandOptions) => {
  return new InitCommand(args)
}

export default init
