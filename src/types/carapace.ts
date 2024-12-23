export type Spec = {
  name: string
  aliases?: string[]
  description?: string
  group?: string
  hidden?: boolean
  run?: string
  parsing?: string
  persistentflags?: Flags
  flags?: Flags
  exclusiveFlags?: string[][]
  completion?: Completion
  commands?: Spec[]
}

export type Completion = {
  flag?: Record<string, string[]>
  positional?: Positional[]
  positionalany?: Positional
  dash?: Positional[]
  dashany?: Positional
}

type Flags = Record<string, string>

type Positional = string[]
