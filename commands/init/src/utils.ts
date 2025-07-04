import fs from 'fs'
import path from 'path'

/**
 * 复制文件
 * @param src 源文件
 * @param dest 目标文件
 */
export const copy = (src: string, dest: string) => {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src)) {
      const srcFile = path.resolve(src, file)
      const destFile = path.resolve(dest, file)
      copy(srcFile, destFile)
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}
