import { exec } from 'child_process';
import promptly from 'promptly';

import { Puzzle } from '../../Puzzle/Puzzle.js';
import { findPuzzles, storePuzzle } from '../../utils/ConfigFile.js';
import { logger } from '../../utils/Logger.js';
import { getDefaultPuzzleDay, throwError } from '../../utils/Utils.js';

export const runHandler = async (options: any) => {
    logger.santa('Ho ho ho ! You are going to run a Puzzle');
    console.log(options);
    let puzzles: Puzzle[] = [];
    if (!options.day) {
        puzzles = await findPuzzles({ last: true });

        if (puzzles.length === 0) {
            puzzles = await findPuzzles({
                year: options.year || new Date().getFullYear(),
                day: options.day || getDefaultPuzzleDay(new Date().getDate().toString()),
            });
        }
    } else {
        puzzles = await findPuzzles({
            year: options.year || new Date().getFullYear(),
            day: Number(options.day),
        });
    }

    if (puzzles.length === 1) {
        const puzzle = puzzles[0];
        runPuzzle(puzzle);
    }

    if (puzzles.length > 1) {
        const choice = await getRunPrompts(puzzles, options);
        runPuzzle(choice.puzzle);
    }

    if (puzzles.length === 0) {
        throwError('No puzzles were found to be launched');
    }
};

const runPuzzle = (puzzle: Puzzle) => {
    if (!puzzle.last) {
        storePuzzle({ ...findPuzzles({ last: true })[0], last: false });
        puzzle.last = true;
        storePuzzle(puzzle);
    }

    if (puzzle.extension === 'ts') {
        logger.start(`Running the TS puzzle ${puzzle.className}`);
        const result = exec(`node ${puzzle.path}`);
        logger.complete(`RESULT: ${result}`);
    }

    if (puzzle.extension === 'js') {
        logger.start(`Running the JS puzzle ${puzzle.className}`);

        const result = exec(`ts-node ${puzzle.path}`);
        logger.complete(`RESULT: ${result}`);
    }

    if (puzzle.extension === 'py') {
        logger.start(`Running the Python puzzle ${puzzle.className}`);
        const result = exec(`python ${puzzle.path}`);
        logger.complete(`RESULT: ${result}`);
    }
};

const getRunPrompts = async (puzzles: Puzzle[], options: any) => {
    logger.pending('What do you want to do ?');
    const choices: { num: number; message: string; puzzle: Puzzle }[] = puzzles.map((curr, num) => {
        // Run puzzle
        return {
            num,
            message: `${num} - Run "${curr.className}.${curr.extension}"`,
            puzzle: curr,
        };
    });

    choices.forEach((c) => logger.choice(c.message));
    const choice = await promptly.choose(
        'Choose an option (Number): ',
        choices.map((p) => `${p.num}`)
    );

    return choices.find((c) => c.num === Number(choice)) || choices[0];
};
