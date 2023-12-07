import { Command } from 'commander';
import fs from 'node:fs';
import figlet from 'figlet';

import { CONFIG_PATH, DEFAULT_CONFIG, getConfig } from '../../utils/ConfigFile.js';
import { CreateCommand } from './CreateCommand.js';
import { RunCommand } from './RunCommand.js';
import { SetupCommand } from './SetupCommand.js';
import { setupHandler } from '../commandHandlers/SetupHandler.js';

if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2));
}

const aocCLICommand = new Command('aoc');
aocCLICommand.addCommand(CreateCommand());
aocCLICommand.addCommand(RunCommand());
aocCLICommand.addCommand(SetupCommand());

if (Object.keys(getConfig()).length === 2 && getConfig().AOC_SESSION_TOKEN === DEFAULT_CONFIG.AOC_SESSION_TOKEN) {
    console.log(figlet.textSync('AOC - CLI', 'Bulbhead'));
    console.log('');
    aocCLICommand.parse([process.argv[0], process.argv[1], 'setup']);
} else {
    aocCLICommand.parse(process.argv);
}
