import colors from 'picocolors'

const createLog = (prefix: string) => {
  return (...args: unknown[]) => {
    if (args.length > 0 && typeof args[0] === 'string') {
      const [label, ...rest] = args
      console.log(prefix, colors.magenta(label), ...rest)
    } else {
      console.log(prefix, ...args)
    }
  }
}

const log = {
  error: createLog(colors.red('ERR')),
  info: createLog(colors.cyan('INFO')),
  warn: createLog(colors.yellow('WARN')),
  success: createLog(colors.green('SUCCESS')),
  verbose: createLog(colors.blue('VERBOSE')),
}

export default log
