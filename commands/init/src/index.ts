import { input, select } from '@inquirer/prompts'
import { Command, log, type CommandOptions } from '@lecuil-cli/utils'
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import { cwd } from 'process'
import semver from 'semver'
import { fileURLToPath } from 'url'
import { FRAMEWORKS, INIT_OPTIONS, INIT_TYPE, UN_COPY_FILES } from './constants'
import type { ProjectInfo } from './type'
import { copy } from './utils'

export class InitCommand extends Command {
  force: boolean = false
  projectInfo: ProjectInfo | null = null

  init(): void {
    this.force = Boolean(this._options.force)
  }

  async exec() {
    try {
      // 准备阶段
      log.verbose('cli', '准备阶段')

      const type = await select({
        message: '请选择初始化类型',
        choices: INIT_OPTIONS,
      })

      if (type === INIT_TYPE.PROJECT) {
        await this.createProject()
      }
    } catch (error) {
      log.error('执行失败', (error as Error).message)
    }
  }

  /**
   * 创建项目
   */
  async createProject() {
    const targetDir = await input({
      message: '请输入项目名称',
      default: 'lecuil-project',
      validate: (v) => {
        const isValidate = /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)
        return isValidate || '项目名称以字母开头，只能包含字母、数字、下划线、中划线'
      },
    })

    if (fs.existsSync(targetDir) && !this.isDirEmpty(targetDir)) {
      const action = await select({
        message: '当前目录不为空，请选择操作',
        choices: [
          {
            name: '清空目录',
            value: 'clear',
          },
          {
            name: '取消',
            value: 'cancel',
          },
        ],
        default: this.force ? 'clear' : 'cancel',
      })
      if (action === 'clear') {
        fse.emptyDirSync(targetDir)
      } else if (action === 'cancel') {
        process.exit(0)
      }
    }

    const o = {
      version: await input({
        message: '请输入项目版本号',
        default: '0.0.0',
        validate: (v) => {
          const isValidate = !!semver.valid(v)
          return isValidate || '版本号格式不正确，示例：1.0.0,v1.0.0'
        },
      }),
      framework: await select({
        message: '请选择框架',
        choices: FRAMEWORKS,
      }),
    }

    const frameworkVariants = FRAMEWORKS.find((f) => f.value === o.framework)?.variants
    if (!frameworkVariants) {
      log.error('cli', '框架不存在')
      process.exit(1)
    }

    const variant = await select({
      message: '请选择版本',
      choices: frameworkVariants,
    })

    const root = path.join(cwd(), targetDir)
    log.verbose('root', root)
    fs.mkdirSync(root, { recursive: true })

    const write = (file: string, content?: string) => {
      const targetPath = path.join(root, file)
      if (content) {
        fs.writeFileSync(targetPath, content)
      } else {
        copy(path.join(templateDir, file), targetPath)
      }
    }

    const templateDir = path.resolve(fileURLToPath(import.meta.url), '../../../../templates', variant)

    const files = fs.readdirSync(templateDir)
    for (const file of files.filter((f) => !UN_COPY_FILES.has(f))) {
      write(file)
    }

    const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, 'package.json'), 'utf-8'))
    pkg.name = targetDir
    pkg.version = semver.valid(o.version) || '0.0.0'
    write('package.json', JSON.stringify(pkg, null, 2) + '\n')
  }

  /**
   * 判断当前目录是否为空
   * @returns
   */
  isDirEmpty(localPath: string) {
    const fileList = fs.readdirSync(localPath)
    return fileList && fileList.filter((file) => !file.startsWith('.') && !['node_modules'].includes(file)).length === 0
  }

  cancel() {
    log.verbose('cancel', '取消')
  }
}

const init = (args: CommandOptions) => {
  return new InitCommand(args)
}

export default init
