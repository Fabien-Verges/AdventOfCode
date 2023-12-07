import { Command } from 'commander';

import { setupHandler } from '../commandHandlers/SetupHandler.js';

export const SetupCommand = () => {
    return new Command('setup')
        .description('Run a setup wizzard to configure your AdventOfCode settings')
        .action(setupHandler);
};
