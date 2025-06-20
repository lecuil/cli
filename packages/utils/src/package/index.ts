import path from 'path'
import { isObject } from '../data/index.js'
import { packageDirectory } from 'package-directory'
import { pathToFileURL } from 'url'
import { formatPath } from '../path/index.js'
// @ts-ignore no types for npminstall
import npminstall from 'npminstall'
import { getDefaultRegistry } from '~utils/npm/index.ts'

export interface PackageOptions {
  targetPath: string
  storePath?: string
  name: string
  version: string
}

export class Package {
  /**
   * Package路径
   */
  targetPath = ''

  /**
   * Package缓存路径
   */
  storePath = ''

  /**
   * Package名称
   */
  name = ''

  /**
   * Package版本
   */
  version = ''

  constructor(options: PackageOptions) {
    if (!options) {
      throw new Error('Package构造函数参数不能为空')
    }
    if (!isObject(options)) {
      throw new Error('Package构造函数参数必须为对象')
    }
    this.targetPath = options.targetPath
    this.storePath = options.storePath || ''
    this.name = options.name
    this.version = options.version
  }

  /**
   * 判断当前Package是否存在
   */
  exists() {
    return true
  }

  /**
   * 安装
   */
  install() {
    return npminstall({
      root: this.targetPath,
      storeDir: this.storePath,
      registry: getDefaultRegistry(),
      pkgs: [
        {
          name: this.name,
          version: this.version,
        },
      ],
    })
  }

  /**
   * 更新
   */
  update() {}

  /**
   * 获取入口文件位置
   */
  async getRootPath() {
    const dir = await packageDirectory({ cwd: this.targetPath })
    if (!dir) return null
    const fileUrl = pathToFileURL(path.resolve(dir, 'package.json')).href
    const pkgFile = (await import(fileUrl, { with: { type: 'json' } })).default
    if (pkgFile && pkgFile.main) {
      // 兼容路径格式
      return formatPath(path.resolve(dir, pkgFile.main))
    }
  }
}
