'use strict'

const pkg = await import('../package.json', { with: { type: 'json' } })

const checkPkgVersion = () => {
  console.log(pkg.default.version)
}

const core = () => {
  checkPkgVersion()
}

export default core
