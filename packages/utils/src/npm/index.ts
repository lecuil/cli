import { join as joinPath } from 'node:path/posix'
import semver from 'semver'

/**
 * 获取npm信息
 * @param npmName 包名
 * @param registry 源
 * @returns
 */
export const getNpmInfo = async (npmName: string, registry: string) => {
  if (!npmName) return null
  const registryUrl = registry || getDefaultRegistry(true)
  const npmInfoUrl = new URL(registryUrl)
  npmInfoUrl.pathname = joinPath(npmName)
  try {
    const json = await fetch(npmInfoUrl.toString())
    if (json.status !== 200) return null
    const data = await json.json()
    return data
  } catch (e) {
    return null
  }
}

/**
 * 获取默认源
 * @param isOriginal 是否为原始源
 * @returns
 */
export const getDefaultRegistry = (isOriginal = false) => {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npmmirror.com'
}

/**
 * 获取npm版本
 * @param npmName 包名
 * @param registry 源
 * @returns
 */
export const getNpmVersions = async (npmName: string, registry: string) => {
  const data = await getNpmInfo(npmName, registry)
  if (!data) return []
  return Object.keys(data.versions)
}

/**
 * 获取semver版本
 * @param baseVersion 基础版本
 * @param versions 版本列表
 * @returns
 */
const getSemverVersions = (baseVersion: string, versions: string[]) => {
  return versions
    .filter((version) => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => Number(semver.gt(b, a)))
}

/**
 * 获取npm semver版本
 * @param baseVersion 基础版本
 * @param npmName 包名
 * @param registry 源
 * @returns
 */
export const getNpmSemverVersions = async (baseVersion: string, npmName: string, registry = getDefaultRegistry()) => {
  const versions = await getNpmVersions(npmName, registry)
  const newVersions = getSemverVersions(baseVersion, versions)
  if (newVersions && newVersions.length > 0) {
    return newVersions[0]
  }
  return null
}

export const getNpmLatestVersion = async (npmName: string, registry = getDefaultRegistry()) => {
  const versions = (await getNpmVersions(npmName, registry)).sort((a, b) => Number(semver.gt(b, a)))
  return versions[0]
}
