import { Command as BaseCommand } from 'commander'

const DEFAULT_OPTIONS: InstallCompletionOptions = {
  overwrite: true,
}

export class NewCommand extends BaseCommand {
  _installCompletion?: InstallCompletionOptions
  _completion?: CompletionOptions
  _carapace?: CarapaceOptions
  commands: NewCommand[] = []

  installCompletion(options = {}) {
    this._installCompletion = { ...DEFAULT_OPTIONS, ...options }
    return this
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

type InstallCompletionOptions = {
  overwrite?: boolean
}

type CompletionOptions = Record<string, any>

type CarapaceOptions = Record<string, any>

export * from 'commander'
export { NewCommand as Command }
export const program = new NewCommand()
