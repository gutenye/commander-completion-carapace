import { describe, expect, it } from 'bun:test'
import { CARAPACE_SPECS_DIR } from '#/constants'
import { fs, logger } from '#/utils'
import { Argument, Command, Option } from '../NewCommand'
import { buildSpecText, installCompletion } from '../installCompletion'

describe('buildSpecText', () => {
  it('works', () => {
    const program = new Command()
    program.name('hello').description('Hello').version('1.0.0')
    program
      .command('cmd1 [arg1]')
      .addArgument(
        new Argument('<arg2>', 'Arg2')
          .choices(['arg2A', 'arg2B'])
          .default(60, 'one minute'),
      )
      .argument('[files...]', 'Files')
      .description('command 1')
      .alias('cmd')
      .alias('c')
      .option('--bool', 'Bool')
      .option('--no-bool2', 'NoBool2')
      .option('-a, --string-a [string]', 'StringA', 'default')
      .option('-b, --string-b [values...]', 'StringB', ['1'])
      .addOption(new Option('--year <year>', 'Year').choices(['2001', '2002']))
      .completion({
        flags: {
          option: ['$files'],
        },
        positional: [null, null, ['$files']],
        positionalany: ['any'],
      })
      .carapace({
        name: 'cmd1Override',
        parsing: 'interspersed',
      })
      .action(() => {})

    const { text } = buildSpecText(program)
    // console.log(text)
    expect(text).toEqual(
      `
name: hello
description: Hello
flags:
  -V, --version: output the version number
commands:
  - name: cmd1Override
    description: command 1
    aliases:
      - cmd
      - c
    flags:
      --bool: Bool
      --no-bool2: NoBool2
      -a, --string-a=?: StringA
      -b, --string-b=?: StringB
      --year=!: Year
    completion:
      positional:
        - []
        - - arg2A
          - arg2B
        - - $files
      flags:
        year:
          - 2001
          - 2002
        option:
          - $files
      positionalany:
        - any
    parsing: interspersed
`.trimStart(),
    )
  })

  it('no description', () => {
    const program = new Command()
    program
      .name('hello')
      .command('cmd1 [files...]')
      .option('--bool')
      .action(() => {})

    expect(buildSpecText(program).text).toEqual(
      `
name: hello
commands:
  - name: cmd1
    flags:
      --bool: ""
`.trimStart(),
    )
  })

  it('no name', () => {
    const program = new Command()
    program.completion()
    expect(() => buildSpecText(program)).toThrow(/command name is missing/)
  })

  it('no completion', () => {
    const program = new Command()
    expect(buildSpecText(program).text).toBeUndefined()
  })

  it('default command', () => {
    const program = new Command()
    program.name('test')
    program
      .command('default [arg1]', { isDefault: true, hidden: true })
      .option('--bool')
      .completion({
        positional: [['Arg1']],
      })
    program.command('sub1')
    const { text } = buildSpecText(program)
    // console.log(text)
    expect(text).toEqual(
      `
name: test
flags:
  --bool: ""
completion:
  positional:
    - - Arg1
commands:
  - name: sub1
`.trimStart(),
    )
  })
})

describe('installCompletion', () => {
  const specFile = `${CARAPACE_SPECS_DIR}/hello.yaml`

  it('overwrites', async () => {
    const program = new Command()
    program.name('hello').installCompletion()
    program.command('cmd1')
    await installCompletion(program)
    expect(await fs.readFile(specFile, 'utf8')).toEqual(
      `
name: hello
commands:
  - name: cmd1
`.trimStart(),
    )
    expect(logger.log).toHaveBeenCalledWith(
      `\nCompletion file is installed to '${specFile}'\n`,
    )
    // overwrite
    program.command('cmd2')
    await installCompletion(program)
    expect(await fs.readFile(specFile, 'utf8')).toEqual(
      `
name: hello
commands:
  - name: cmd1
  - name: cmd2
`.trimStart(),
    )
    expect(logger.log).toHaveBeenCalledWith(
      `\nCompletion file is installed to '${specFile}'\n`,
    )
  })

  it('skips if no installCompletion', async () => {
    const program = new Command()
    program.name('hello')
    await installCompletion(program)
    expect(await fs.pathExists(specFile)).toBeFalsy()
  })

  it('skips if no commands', async () => {
    const program = new Command()
    program.name('hello').installCompletion()
    await installCompletion(program)
    const path = `${CARAPACE_SPECS_DIR}/hello.yaml`
    expect(await fs.pathExists(specFile)).toBeFalsy()
  })
})
