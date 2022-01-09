import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import handlebars from "handlebars";
import { groupBy } from 'lodash';
import promptly from "promptly";

import { Puzzle } from "../Puzzle";
import { logger } from "./Logger";
import { getPuzzles, storePuzzles } from "./dbUtils";

export const camelize = (str: string) =>
    str
        .replace(/\b(\w)/g, (match, capture) => capture.toUpperCase())
        .replace(/\s+/g, "")
        .replace(/-+/g, "");

export const getDefaultPuzzleDay = (day: string): number => {
    return Number(day) > 24 ? 24 : Number(day);
};

export const getCreatePrompts = async (puzzles: Puzzle[], name: string) => {
    logger.pending('What do you want to do ?');
    const prompts: { prompts: string[], choices: string[] } = {prompts: [], choices: []};
    puzzles.reduce((acc, curr, i, a) => {
        acc.prompts.push(`${i} - Continue with "${a[i].name}"`);
        acc.choices.push(`${i}`);
        return acc;
    }, prompts);

    prompts.prompts.push(`${puzzles.length} - Create a new puzzle named "${name}"`);
    prompts.choices.push(`${puzzles.length}`)
    prompts.prompts.forEach((p) => logger.choice(p));
    const choice = Number(await promptly.choose('Choose an option (Number): ', prompts.choices));

    return {
        create: choice === puzzles.length,
        ...(choice === puzzles.length ? {} : {puzzleId: puzzles[choice].id})
    }
}

export const createPuzzle = async (properties: any) => {
    const existingPuzzles = await getPuzzles();
    const puzzle: Puzzle = {
        id: randomUUID(),
        name: properties.name,
        day: properties.day,
        year: properties.year,
        number: existingPuzzles.filter(p => p.year === properties.year && p.day === properties.day).length + 1,
        last: false,
    };

    const puzzleClassName = camelize(properties.name);
    const PUZZLE_BASE_DIR_PATH = "src/Puzzles";
    const PUZZLE_YEAR_DIR_PATH = `${PUZZLE_BASE_DIR_PATH}/${puzzle.year}`;
    const PUZZLE_DAY_DIR_PATH = `${PUZZLE_YEAR_DIR_PATH}/${puzzle.day}`;
    const PUZZLE_FILE_PATH = `${PUZZLE_DAY_DIR_PATH}/${puzzle.number}_${puzzleClassName}.ts`;
    const puzzleTemplate = await fs.readFile("./src/Puzzle/puzzle.hbs", {
        encoding: "utf8",
    });
    await fs.mkdir(PUZZLE_DAY_DIR_PATH, {recursive: true});
    await fs.writeFile(
        PUZZLE_FILE_PATH,
        handlebars.compile(puzzleTemplate)({ puzzleClassName })
    );
    await storePuzzles([...existingPuzzles, puzzle])
    await updateIndexes();
}

const updateIndexes = async () => {
    const existingPuzzles = await getPuzzles();
    const groupedByYearPuzzles = groupBy(existingPuzzles, 'year');
    const indexTemplate = await fs.readFile("./src/Puzzle/index.hbs", {
        encoding: "utf8",
    }).catch((e) => {
        logger.error('An error occurred while retrieving indexes template')
        return Promise.reject(e);
    });

    const sortedYears = Object.keys(groupedByYearPuzzles).sort((a: any, b: any) => a - b);

    // Writing global index
    await fs.writeFile(
        './src/Puzzles/index.ts',
        handlebars.compile(indexTemplate)({ IsDay: false, Years: sortedYears })
    );

    // Writing each year indexes
    for (const y of sortedYears) {
        const sortedDays = new Set(groupedByYearPuzzles[y as string].map((p: Puzzle) => p.day).sort((a: any, b: any) => a - b))
        await fs.writeFile(
            `./src/Puzzles/${y}/index.ts`,
            handlebars.compile(indexTemplate)({ IsDay: true, Days: sortedDays })
        );
    }
}
