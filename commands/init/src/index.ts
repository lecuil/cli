import { Command, type CommandOptions } from '@lecuil-cli/utils'

export class InitCommand extends Command {
  force: boolean = false

  init(): void {
    this.force = Boolean(this._options.force)
  }

  exec(): void {}
}

const init = (...args: CommandOptions) => {
  return new InitCommand(args)
}

export default init
