import colors from 'picocolors'
import type { Framework } from './type'

const { green, blue, blueBright, cyan, greenBright, magenta, red, redBright, reset, yellow, yellowBright } = colors

/**
 * 初始化类型
 */
export const INIT_TYPE = {
  PROJECT: 'project',
  COMPONENT: 'component',
}

/**
 * 初始化选项
 */
export const INIT_OPTIONS = [
  { name: '项目', value: INIT_TYPE.PROJECT },
  { name: '组件', value: INIT_TYPE.COMPONENT },
]

/**
 * 框架
 */
export const FRAMEWORKS = [
  {
    value: 'react',
    name: blue('React'),
    variants: [
      { value: 'react-ts', name: blueBright('TypeScript') },
      { value: 'react-js', name: yellowBright('JavaScript') },
    ],
  },
  {
    value: 'vue',
    name: green('Vue'),
    variants: [
      { value: 'vue-ts', name: greenBright('TypeScript') },
      { value: 'vue-js', name: yellowBright('JavaScript') },
    ],
  },
] as Framework[]

/**
 * 不复制文件
 */
export const UN_COPY_FILES = new Set(['package.json', 'node_modules'])
