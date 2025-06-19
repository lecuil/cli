import { isObject } from '../data/index.js'

export class Package {
  /**
   * Package路径
   */
  targetPath = ''

  /**
   * Package存储路径
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

  constructor(options) {
    if (!options) {
      throw new Error('Package构造函数参数不能为空')
    }
    if (!isObject(options)) {
      throw new Error('Package构造函数参数必须为对象')
    }
    this.targetPath = options.targetPath
    this.storePath = options.storePath
    this.name = options.name
    this.version = options.version
  }

  /**
   * 判断当前Package是否存在
   */
  exists() {}

  /**
   * 安装
   */
  install() {}

  /**
   * 更新
   */
  update() {}

  /**
   * 获取入口文件位置
   */
  getRootPath() {}
}
