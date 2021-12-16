import { Command } from "commander";
import { runHandler } from "../commandHandlers";

export const PuzzleRunCommand = () => {
    return new Command('run')
        .alias('r')
        .description('Run a puzzle')
        .option('-y, --year <year>', 'The year of the puzzle you want to run', new Date().getFullYear().toString())
        .option('-d, --day <day>', 'The day of the puzzle you want to run', new Date().getDate().toString())
        .action(runHandler);
}
