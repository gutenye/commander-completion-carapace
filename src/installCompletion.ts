import { merge } from 'lodash-es'
import invariant from 'tiny-invariant'
import * as yaml from 'yaml'
import { program as defaultProgram } from '#/NewCommand'
import { CARAPACE_SPECS_DIR } from '#/constants'
import type { Carapace, NewCommand } from '#/types/index'
import { fs, logger, mergeWithoutNull, question } from '#/utils/index'

export async function installCompletion(program = defaultProgram) {
  if (!program._installCompletion) {
    return
  }

  const { spec, text } = buildSpecText(program)
  if (!text) {
    return
  }
  const path = `${CARAPACE_SPECS_DIR}/${spec.name}.yaml`
  const content = await fs.inputFile(path, 'utf8')
  if (content) {
    if (content === text) {
      return
    }
    if (!program._installCompletion.overwrite) {
      const answer = await question(
        `Overwrite completion file '${path}'? [y/n] `,
      )
      const newAnswer = answer.trim().toLowerCase()
      if (newAnswer !== 'y') {
        return
      }
    }
  }

  await fs.outputFile(path, text)
  logger.log(`\nCompletion file is installed to '${path}'\n`)
}

function buildRootSpec(rootCommand: NewCommand): Carapace.Spec {
  const rootSpec = buildSpec(rootCommand)
  invariant(rootSpec, 'rootSpec is undefined')

  const defaultCommand = rootCommand._findCommand(
    rootCommand._defaultCommandName,
  )
  if (defaultCommand) {
    const defaultSpec = buildSpec(defaultCommand, { force: true })
    if (defaultSpec?.flags) {
      rootSpec.flags = rootSpec.flags || {}
      merge(rootSpec.flags, defaultSpec.flags)
    }
    if (defaultSpec?.completion) {
      rootSpec.completion = rootSpec.completion || {}
      merge(rootSpec.completion, defaultSpec.completion)
    }
  }
  return rootSpec
}

// I'm recursive
function buildSpec(
  command: NewCommand,
  { force }: BuildSpecOptions = {},
): Carapace.Spec | undefined {
  if (command._hidden && !force) {
    return
  }

  const spec: Carapace.Spec = {
    name: command._name,
  }

  if (command._description) {
    spec.description = command._description
  }

  if (command._aliases.length > 0) {
    spec.aliases = command._aliases
  }

  const completion: Carapace.Completion = {}
  const positional = []
  for (const argument of command.registeredArguments) {
    positional.push(argument.argChoices || [])
  }
  if (positional.some((v) => v.length > 0)) {
    completion.positional = positional
  }
  for (const option of command.options) {
    spec.flags = spec.flags || {}
    let flag = [option.short, option.long].filter(Boolean).join(', ')
    if (!option.isBoolean) {
      flag += '='
    }
    if (option.required) {
      flag += '=!'
    }
    if (option.optional) {
      flag += '=?'
    }
    spec.flags[flag] = option.description
    if (option.argChoices) {
      completion.flag = completion.flag || {}
      completion.flag[option.name()] = option.argChoices
    }
  }

  if (Object.keys(completion).length > 0) {
    spec.completion = completion
  }

  if (command._completion) {
    spec.completion = spec.completion || {}
    mergeWithoutNull(spec.completion, command._completion)
  }

  if (command._carapace) {
    mergeWithoutNull(spec, command._carapace)
  }

  for (const subcommand of command.commands) {
    const newSpec = buildSpec(subcommand)
    if (newSpec) {
      spec.commands = spec.commands || []
      spec.commands.push(newSpec)
    }
  }

  return spec
}

export function buildSpecText(command: NewCommand) {
  const spec = buildRootSpec(command)

  if (
    !(spec.commands || spec.persistentflags || spec.flags || spec.completion)
  ) {
    return {}
  }

  if (!command._name) {
    throw new Error(
      '[completion.buildSpecText] command name is missing, use program.name() to define it',
    )
  }

  const text = yaml.stringify(spec)
  return { spec, text }
}

type BuildSpecOptions = {
  force?: boolean
}
