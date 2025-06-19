import { Package } from '../package/index.js'

export const exec = () => {
  const pkg = new Package()
  console.log(pkg, 'pkg')
  console.log('exec')
  console.log(process.env.CLI_TARGET_PATH)
  console.log(process.env.CLI_HOME_PATH)
}
