import { Command } from 'commander';

import { CreatePuzzleCommand } from './CreatePuzzleCommand.js';

export const CreateCommand = () => {
    return new Command('create')
        .description('Create puzzle')
        .alias('c')
        .alias('g')
        .alias('generate')
        .addCommand(CreatePuzzleCommand());
};
