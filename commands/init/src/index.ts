import { Command, type CommandOptions } from '@lecuil-cli/utils'

export class InitCommand extends Command {}

const init = (...args: CommandOptions) => {
  return new InitCommand(args)
}

export default init
