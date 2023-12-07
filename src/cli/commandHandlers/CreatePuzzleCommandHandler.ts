import { exec } from 'child_process';
import promptly from 'promptly';

import { Puzzle } from '../../Puzzle/Puzzle.js';
import { getName } from '../../utils/AdventOfCode.js';
import { findPuzzles } from '../../utils/ConfigFile.js';
import { logger } from '../../utils/Logger.js';
import { createPuzzle } from '../../utils/PuzzlesFolder.js';
import { camelize } from '../../utils/Utils.js';

export const createPuzzleHandler = async (options: any) => {
    logger.santa('Ho ho ho! You are going to create a new Puzzle');

    // process the puzzle name
    options.name = options.name ?? camelize(await getName(options.year, options.day));
    

    // get existing puzzles
    const puzzles = await findPuzzles({
        year: Number(options.year),
        day: options.day,
        extension: options.extension,
    });
    if (puzzles.length) {
        if (puzzles.length === 1) logger.warn('It seems that a puzzle already exists for this day');
        else {
            logger.warn('It seems that some puzzles already exists for this day');
        }

        const choice = await getCreatePrompts(puzzles, options);

        if (choice.action === 'open') {
            logger.await(`Opening puzzle ${choice.puzzle?.className}...`);
            exec(`open ${choice.puzzle.path}`);
        }

        if (choice.action === 'newPart') {
            options.part = choice.puzzle.part + 1;
            options.version = choice.puzzle.version;
            logger.await(
                `Creating new ${choice.puzzle.name} puzzle: version ${options.version}, part ${options.part}...`
            );
            const newPuzzle = await createPuzzle(options);
            logger.success('Your puzzle have been successfully created');
            if (options.open) {
                logger.await(`Opening puzzle ${newPuzzle.className}...`);
                exec(`open ${newPuzzle.path}`);
            }
        }

        if (choice.action === 'newVersion') {
            options.part = choice.puzzle.part;
            options.version = choice.puzzle.version + 1;
            logger.await(
                `Creating new ${choice.puzzle.name} puzzle: version ${options.version}, part ${options.part}...`
            );
            const newPuzzle = await createPuzzle(options);
            logger.success('Your puzzle have been successfully created');
            if (options.open) {
                logger.await(`Opening puzzle ${newPuzzle.className}...`);
                exec(`open ${newPuzzle.path}`);
            }
        }

        return;
    }

    // No puzzle found for the provided day, creating new puzzle
    options.part = 1;
    options.version = 1;
    logger.await(`Creating new ${options.name} puzzle: version ${options.version}, part ${options.part}...`);
    const newPuzzle = await createPuzzle(options);
    logger.success('Your puzzle have been successfully created');
    if (options.open) {
        logger.await(`Opening puzzle ${newPuzzle.className}...`);
        exec(`open ${newPuzzle.path}`);
    }
};

const getCreatePrompts = async (puzzles: Puzzle[], options: any) => {
    logger.pending('What do you want to do ?');
    let prompts: { num: number; message: string }[] = [],
        choices: {
            action: string;
            num: number;
            puzzle: Puzzle;
        }[] = [];

    puzzles.reduce((prompts, curr) => {
        const num = (prompts[prompts.length - 1]?.num || 0) + 1;
        // Open existing puzzle
        prompts.push({
            num,
            message: `${num} - Open existing puzzle "${curr.className}.${curr.extension}"`,
        });
        choices.push({ action: 'open', num, puzzle: curr });

        // Create a new puzzle from an existing one (like part 2 of a puzzle)
        prompts.push({
            num: num + 1,
            message: `${num + 1} - Create the next part for puzzle "${curr.className}.${curr.extension}"`,
        });
        choices.push({ action: 'newPart', num: num + 1, puzzle: curr });

        // Create a new version of a puzzle (for example in other language, or just a new code version)
        prompts.push({
            num: num + 2,
            message: `${num + 2} - Create another version of puzzle "${curr.className}.${curr.extension}"`,
        });
        choices.push({ action: 'newVersion', num: num + 2, puzzle: curr });

        return prompts;
    }, prompts);

    prompts.forEach((p) => logger.choice(p.message));
    const choice = await promptly.choose(
        'Choose an option (Number): ',
        choices.map((c) => `${c.num}`)
    );

    return choices.find((c) => c.num === Number(choice))!;
};
