/**
 * 判断一个值是否是Object
 * @param value
 * @returns
 */
export const isObject = (value: unknown) => {
  return Object.prototype.toString.call(value) === '[object Object]'
}
