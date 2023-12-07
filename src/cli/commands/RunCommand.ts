import { Command } from 'commander';

import { runHandler } from '../commandHandlers/RunPuzzleCommandHandler.js';

export const RunCommand = () => {
    return new Command('run')
        .alias('r')
        .description('Run a puzzle')
        .option('-y, --year <year>', 'The year of the puzzle you want to run', '')
        .option('-d, --day <day>', 'The day of the puzzle you want to run', '')
        .option('-uci, --use-custom-input', 'Force this run to use a custom input instead of using the puzzle setting')
        .action(runHandler);
};
