import { Command as BaseCommand } from 'commander'
import { installCompletion } from './installCompletion'

const DEFAULT_OPTIONS: EnableCompletionOptions = {
  overwrite: true,
}

export class NewCommand extends BaseCommand {
  _enableCompletion?: EnableCompletionOptions
  _completion?: CompletionOptions
  _carapace?: CarapaceOptions
  commands: NewCommand[] = []

  enableCompletion(options = {}) {
    this._enableCompletion = { ...DEFAULT_OPTIONS, ...options }
    return this
  }

  async installCompletion() {
    return installCompletion(this)
  }

  completion(options = {}) {
    this._completion = options
    return this
  }

  carapace(options = {}) {
    this._carapace = options
    return this
  }

  createCommand(name: string) {
    return new NewCommand(name)
  }
}

type EnableCompletionOptions = {
  overwrite?: boolean
}

type CompletionOptions = Record<string, any>

type CarapaceOptions = Record<string, any>

export * from 'commander'
export { NewCommand as Command }
export const program = new NewCommand()
