export default async function main({ program, Argument }) {
  program.name('cli').enableCompletion()

  program
    .command('cmd1')
    .addArgument(new Argument('[arg1]').choices(['arg1', 'arg2', 'arg3']))
    .option('--option1')
    .option('--option2')
    .action((arg1, options) => {
      console.log('args:', [arg1])
      console.log('options:', options)
    })

  program.command('cmd2')

  program.command('cmd3')

  await program.installCompletion()

  program.parse()
}
