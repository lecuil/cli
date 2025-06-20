#! /usr/bin/env node

import { log } from '@lecuil-cli/utils'
import importLocal from 'import-local'
import { fileURLToPath } from 'url'
import main from '../src'

const __filename = fileURLToPath(import.meta.url)

if (importLocal(__filename)) {
  log.info('cli', '使用 cli 本地版')
} else {
  // main(process.argv.slice(2))
  main()
}
