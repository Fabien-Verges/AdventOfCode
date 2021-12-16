import { Command } from "commander";
import { createHandler } from "../commandHandlers";

export const PuzzleCreateCommand = () => {
    return new Command('create')
        .alias('c')
        .description('Create a new puzzle')
        .option('-n, --name', 'The fabulous name of your puzzle', 'UnnamedPuzzle')
        .option('-y, --year', 'The AdventOdCode year you want to use for your puzzle', new Date().getFullYear().toString())
        .option('-d, --day', 'The AdventOdCode day you want to use for your puzzle', new Date().getDate().toString())
        .action(createHandler);
}
