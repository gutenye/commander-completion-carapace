import type { Command } from 'commander'
import type { NewCommand } from '#/NewCommand'

declare module 'commander' {
  interface Command {
    _defaultCommandName?: string
    _findCommand(name?: string): NewCommand | undefined
    _hidden: boolean
    _name: string
    _description?: string
    _aliases: string[]
  }
}
