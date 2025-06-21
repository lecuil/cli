import path from 'path'
import { isObject } from '../data/index.js'
import { packageDirectory } from 'package-directory'
import { pathToFileURL } from 'url'
import { formatPath } from '../path/index.js'
// @ts-ignore no types for npminstall
import npminstall from 'npminstall'
import { getDefaultRegistry, getNpmLatestVersion } from '~utils/npm/index.ts'
import { existsSync } from 'fs'
import log from '~utils/log/index.js'

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

  cacheFilePrefix = ''

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
    this.cacheFilePrefix = this.name.replace('/', '_')
  }

  get cacheFilePath() {
    return path.resolve(this.storePath, `_${this.cacheFilePrefix}@${this.version}@${this.name}`)
  }

  /**
   * 准备函数，获取最新的版本号
   */
  async prepare() {
    if (this.version === 'latest') {
      const version = await getNpmLatestVersion(this.name, getDefaultRegistry())
      if (version) this.version = version
    }
  }

  /**
   * 判断当前Package是否存在
   */
  async exists() {
    if (this.storePath) {
      await this.prepare()
      return existsSync(this.cacheFilePath)
    } else {
      return existsSync(this.targetPath)
    }
  }

  /**
   * 安装
   */
  async install() {
    await this.prepare()
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
