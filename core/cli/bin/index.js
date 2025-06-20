#! /usr/bin/env node

import importLocal from 'import-local'
import npmlog from 'npmlog'
import main from '../src/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

if (importLocal(__filename)) {
  npmlog.info('cli', '使用 cli 本地版')
} else {
  main(process.argv.slice(2))
}
