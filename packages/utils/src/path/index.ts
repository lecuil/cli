import path from 'path'

/**
 * 格式化兼容路径
 * @param p
 * @returns
 */
export const formatPath = (p: string) => {
  if (!p && typeof p !== 'string') return p
  const sep = path.sep
  console.log(sep)
  if (sep === '/') {
    return p
  } else {
    return p.replace(/\\/g, '/')
  }
}
