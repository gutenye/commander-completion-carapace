# ⌘ Commander Completion Carapace ⌘

[![Stars](https://img.shields.io/github/stars/gutenye/commander-completion-carapace?style=social)](https://github.com/gutenye/commander-completion-carapace) [![NPM Version](https://img.shields.io/npm/v/@gutenye/commander-completion-carapace)](https://www.npmjs.com/package/@gutenye/commander-completion-carapace) [![License](https://img.shields.io/github/license/gutenye/commander-completion-carapace?color=blue)](https://github.com/gutenye/commander-completion-carapace/blob/main/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue)](https://github.com/gutenye/commander-completion-carapace#-contribute)

Effortlessly add intelligent autocomplete support to your [Commander.js](https://github.com/tj/commander.js) CLI app using [Carapace](https://github.com/carapace-sh/carapace-bin).
 It works with a wide range of shells, making your CLI tools more intuitive and user-friendly.

**Show your ❤️ and support by starring this project and following the author, [Guten Ye](https://github.com/gutenye)!**

<a target="_blank" href="https://asciinema.org/a/GyJv0xAaZqGp9k1TFNcnaiB9y">![screenrecording](https://asciinema.org/a/GyJv0xAaZqGp9k1TFNcnaiB9y.svg)</a>

## 🌟 Features

- ⌘ **Multiple Shells Support**: Works with Bash, Zsh, Fish, Nushell, and more.
- 🚄 **Blazing Fast Completion**: Experience instantaneous completion with no delays.
- 🔗 **Carapace Integration**: Unlock all the powerful features of Carapace, including advanced shell completions.
- 🧑‍💻 **Effortless Integration**: Easily add completion support to your Commander.js based CLI app.

## 🚀 Getting Started

### 1️⃣ Install

First, make sure Carapace is installed, as it powers the completion functionality:

```sh
bun add @gutenye/commander-completion-carapace commander
```

### 2️⃣ Write Completion Code

Now, integrate completion support into your Commander.js application by adding the following code:

```ts
import { program, Option } from '@gutenye/commander-completion-carapace'

program
  .name('hello')
  .enableCompletion()

program.command('cmd1 [...files]')
  .description('Description')
  .option('--option1', 'Description')
  .completion({   // pass to carapace 
    positonalany: ['$files'] // dynamic completion
  })
  .action(() => {})

await program.installCompletion() // Creates hello.yaml Carapace spec file

program.parse()
```

### 3️⃣ Use the Completion

```sh
hello      # Will create the Carapace spec file the first time it runs
hello<Tab> # Press Tab to see completions for commands and options
```

## 🤝 Contribute

We welcome contributions! Whether it’s bug reports, feature suggestions, or pull requests, your involvement makes this project better.

**How to Contribute:**

1. Fork the Repository
2. Open a Pull Request on Github

---

Thank you for using Commander Completion Carapace! ✨ If you found it helpful, please ⭐️ star the project ️️⭐ on GitHub. If you encounter any issues, feel free to report an issue on Github.

**Special thanks to all the contributors:**

[![](https://contrib.rocks/image?repo=gutenye/commander-completion-carapace)](https://github.com/gutenye/commander-completion-carapace/graphs/contributors)

[⬆ Back to top ⬆](#readme)