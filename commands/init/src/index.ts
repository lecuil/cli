import { Command, log, type CommandOptions } from '@lecuil-cli/utils'
import fs from 'fs'

export class InitCommand extends Command {
  force: boolean = false

  init(): void {
    this.force = Boolean(this._options.force)
  }

  exec(): void {
    try {
      // 准备阶段
      this.prepare()

      // 下载模板
      // 安装模板
    } catch (error) {
      log.error('执行失败', (error as Error).message)
    }
  }

  prepare() {
    if (!this.isCwdEmpty()) {
    }

    // 判断是否强制更新
    // 选择创建项目或文件
    // 获取项目基本信息
  }

  /**
   * 判断当前目录是否为空
   * @returns
   */
  private isCwdEmpty() {
    const localPath = process.cwd()
    const fileList = fs.readdirSync(localPath)
    return fileList && fileList.filter((file) => !file.startsWith('.') && ['node_modules'].includes(file)).length === 0
  }
}

const init = (args: CommandOptions) => {
  return new InitCommand(args)
}

export default init
