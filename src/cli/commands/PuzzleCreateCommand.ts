import { Command } from "commander";

import { createHandler } from "../commandHandlers";
import { getDefaultPuzzleDay } from "../../utils";

export const PuzzleCreateCommand = () => {
    return new Command('create')
        .alias('c')
        .description('Create a new puzzle')
        .option('-n, --name <name>', 'The fabulous name of your puzzle', 'UnnamedPuzzle')
        .option('-y, --year <year>', 'The AdventOdCode year you want to use for your puzzle', new Date().getFullYear().toString())
        .option('-d, --day <day>', 'The AdventOdCode day you want to use for your puzzle', getDefaultPuzzleDay(new Date().getDate().toString()).toString())
        .action(createHandler);
}
