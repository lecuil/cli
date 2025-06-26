import { Command, log, type CommandOptions } from '@lecuil-cli/utils'
import fs from 'fs'
import { confirm } from '@inquirer/prompts'
import fse from 'fs-extra'

export class InitCommand extends Command {
  force: boolean = false

  init(): void {
    this.force = Boolean(this._options.force)
  }

  async exec() {
    try {
      // 准备阶段
      await this.prepare()

      // 下载模板
      // 安装模板
    } catch (error) {
      log.error('执行失败', (error as Error).message)
    }
  }

  async prepare() {
    const localPath = process.cwd()
    if (!this.isDirEmpty(localPath)) {
      let isContinue = false
      if (!this.force) {
        isContinue = await confirm({
          message: '当前目录不为空，是否继续？',
          default: false,
        })
        if (!isContinue) return
      }

      log.verbose('localPath', localPath)
      if (isContinue || this.force) {
        const confirmDelete = await confirm({
          message: '是否确认清空当前目录？',
          default: false,
        })
        if (confirmDelete) {
          fse.emptyDirSync(localPath)
        }
      }
    }

    // 选择创建项目或文件
    // 获取项目基本信息
  }

  /**
   * 判断当前目录是否为空
   * @returns
   */
  private isDirEmpty(localPath: string) {
    const fileList = fs.readdirSync(localPath)
    return fileList && fileList.filter((file) => !file.startsWith('.') && ['node_modules'].includes(file)).length === 0
  }
}

const init = (args: CommandOptions) => {
  return new InitCommand(args)
}

export default init
