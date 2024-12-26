#!/usr/bin/env node

import { Argument, program } from '../build/index.js'
import main from './cli.js'

main({ program, Argument })
