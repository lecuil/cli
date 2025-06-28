import { Command, log, type CommandOptions } from '@lecuil-cli/utils'
import fs from 'fs'
import { confirm, input, select } from '@inquirer/prompts'
import fse from 'fs-extra'
import { INIT_OPTIONS, INIT_TYPE } from './constants'
import semver from 'semver'

export class InitCommand extends Command {
  force: boolean = false

  init(): void {
    this.force = Boolean(this._options.force)
  }

  async exec() {
    try {
      // 准备阶段
      log.verbose('cli', '准备阶段')
      await this.prepare()

      // 下载模板
      // 安装模板
    } catch (error) {
      log.error('执行失败', (error as Error).message)
    }
  }

  /**
   * 初始化准备阶段
   * @returns
   */
  async prepare() {
    const localPath = process.cwd()
    log.verbose('localPath', localPath)
    if (!this.isDirEmpty(localPath)) {
      let isContinue = false
      if (!this.force) {
        isContinue = await confirm({
          message: '当前目录不为空，是否继续？',
          default: false,
        })
        if (!isContinue) return
      }

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

    return this.getProjectInfo()
  }

  /**
   * 获取项目初始化信息
   * @returns
   */
  private async getProjectInfo() {
    const projectInfo = {}
    const type = await select({
      message: '请选择初始化类型',
      choices: INIT_OPTIONS,
    })
    log.verbose('type', type)
    // 获取项目基本信息
    if (type === INIT_TYPE.PROJECT) {
      const o = {
        projectName: await input({
          message: '请输入项目名称',
          default: '',
          validate: (v) => {
            const isValidate = /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)
            return isValidate || '项目名称以字母开头，只能包含字母、数字、下划线、中划线'
          },
        }),
        version: await input({
          message: '请输入项目版本号',
          default: '0.0.0',
          validate: (v) => {
            const isValidate = !!semver.valid(v)
            return isValidate || '版本号格式不正确，示例：1.0.0,v1.0.0'
          },
        }),
      }
      console.log(o, 'o')
      console.log(semver.valid(o.version), 'version')
    } else if (type === INIT_TYPE.COMPONENT) {
    }
    return projectInfo
  }

  /**
   * 判断当前目录是否为空
   * @returns
   */
  private isDirEmpty(localPath: string) {
    const fileList = fs.readdirSync(localPath)
    return fileList && fileList.filter((file) => !file.startsWith('.') && !['node_modules'].includes(file)).length === 0
  }
}

const init = (args: CommandOptions) => {
  return new InitCommand(args)
}

export default init
