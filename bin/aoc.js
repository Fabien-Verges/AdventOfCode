#!/usr/bin/env node
/*!
 * AdventOfCode: v1.0.0
 * Copyright(c) 2023 Fabien VERGES
 * ISC Licensed
 */

'use strict';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import fs from 'node:fs';
import { join } from 'node:path';

const local = join(process.cwd(), './node_modules/AdventOfCode/dist/src/cli/commands/AOC.js');
const yamlincPath = fs.existsSync(local) ? local : '../dist/src/cli/commands/AOC.js';
const require = createRequire(import.meta.url);

await import(pathToFileURL(require.resolve(yamlincPath)));
