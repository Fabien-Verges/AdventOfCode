import { Command } from 'commander';

import { getConfig } from '../../utils/ConfigFile.js';
import { getDefaultPuzzleDay } from '../../utils/Utils.js';
import { createPuzzleHandler } from '../commandHandlers/CreatePuzzleCommandHandler.js';

export const CreatePuzzleCommand = () => {
    return new Command('puzzle')
        .alias('p')
        .description('Create a new puzzle structure')
        .option('-n, --name <name>', 'The fabulous name of your puzzle')
        .option(
            '-y, --year <year>',
            'The AdventOdCode year you want to use for your puzzle',
            new Date().getFullYear().toString()
        )
        .option(
            '-d, --day <day>',
            'The AdventOdCode day you want to use for your puzzle',
            getDefaultPuzzleDay(new Date().getDate().toString()).toString()
        )
        .option(
            '-e, --extension <ts|js|py>',
            'Define the language of your code for this puzzle. For now you can choose between TypeScript (ts), JavaScript (js) or Python (py)',
            getConfig().PUZZLE_EXTENSION
        )
        .option('-o, --open', 'open the puzzle file once created')
        .option('-uci, --use-custom-input', 'Use a custom input for this puzzle instead of the AdventOfCode one', false)
        .action(createPuzzleHandler);
};
