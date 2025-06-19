import path from 'path'

export const formatPath = (p) => {
  if (!p && typeof p !== 'string') return p
  const sep = path.sep
  console.log(sep)
  if (sep === '/') {
    return p
  } else {
    return p.replace(/\\/g, '/')
  }
}
