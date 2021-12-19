import { Command } from 'commander';
import { PuzzleCreateCommand } from "./PuzzleCreateCommand";
import { PuzzleRunCommand } from "./PuzzleRunCommand";

const puzzleCommand = new Command('puzzle');

puzzleCommand.alias('p');
puzzleCommand.addCommand(PuzzleCreateCommand());
puzzleCommand.addCommand(PuzzleRunCommand());

puzzleCommand.parse(process.argv);
