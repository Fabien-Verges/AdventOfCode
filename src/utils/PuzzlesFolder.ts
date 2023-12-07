import { randomUUID } from 'crypto';
import handlebars from 'handlebars';
import fs from 'node:fs';
import { join, parse } from 'path';

import { Puzzle, PuzzleFromCli } from '../Puzzle/Puzzle.js';
import { getInput, getName } from './AdventOfCode.js';
import { getConfig, storePuzzle } from './ConfigFile.js';
import { logger } from './Logger.js';
import { getClassName, getDefaultPuzzleDay } from './Utils.js';

export const createPuzzle = async (properties: PuzzleFromCli): Promise<Puzzle> => {
    const config = getConfig();
    const puzzle: Puzzle = {
        id: randomUUID(),
        name: properties.name,
        className: '',
        day: getDefaultPuzzleDay(properties.day),
        year: Number(properties.year),
        version: Number(properties.version),
        part: Number(properties.part),
        last: false,
        path: '',
        extension: properties.extension,
        useCustomInput: properties.useCustomInput,
    };

    puzzle.className = getClassName(puzzle);

    const PUZZLE_YEAR_DIR_PATH = `${config.PUZZLES_FOLDER_PATH}/${puzzle.year}`;
    const PUZZLE_DAY_DIR_PATH = `${PUZZLE_YEAR_DIR_PATH}/${puzzle.day}`;
    const PUZZLE_FILE_PATH = `${PUZZLE_DAY_DIR_PATH}/${puzzle.className}.${puzzle.extension}`;

    const puzzleTemplate = fs.readFileSync('./src/Puzzle/puzzle.hbs', {
        encoding: 'utf8',
    });

    fs.mkdirSync(PUZZLE_DAY_DIR_PATH, { recursive: true });
    fs.writeFileSync(
        PUZZLE_FILE_PATH,
        handlebars.compile(puzzleTemplate)({
            name: puzzle.name,
            puzzleClassName: puzzle.className,
            input: await getInput(puzzle.year, puzzle.day),
            day: puzzle.day,
            year: puzzle.year,
            isTS: puzzle.extension === 'ts',
            isPY: puzzle.extension === 'py',
            isJS: puzzle.extension === 'js',
        })
    );
    puzzle.path = PUZZLE_FILE_PATH;

    storePuzzle(puzzle);
    return puzzle;
};

export async function getPuzzlesFromFolder(
    path: string,
    year = '',
    day = '',
    puzzles: Puzzle[] = []
): Promise<Puzzle[]> {
    logger.await(`Loading puzzles from ${path}...`);
    const folderContent = fs.readdirSync(path);
    folderContent.forEach(async (elem) => {
        elem = join(path, elem);
        if (fs.statSync(elem).isDirectory()) {
            const foundYear = year || (elem.match(/20\d{2}/) ?? [''])[0];
            const foundDay = !foundYear ? (elem.match(/(0[1-9]|[12]\d|3[01])/) ?? [''])[0] : '';
            getPuzzlesFromFolder(elem, foundYear, foundDay, puzzles);
        }
        if (fs.statSync(elem).isFile()) {
            const parsedFile = parse(elem);
            const foundName = [...parsedFile.name.matchAll(/([^\d]+)[_\-\d]+Part\d+/g)][0][1] || '';
            const foundVersion = [...parsedFile.name.matchAll(/(\d+)Part/g)][0][1] || '';
            const foundPart = [...parsedFile.name.matchAll(/Part(\d+)/g)][0][1] || '';
            const foundExtension = parsedFile.ext.replace('.', '');

            const newPuzzle: Puzzle = {
                id: randomUUID(),
                name: foundName || (await getName(Number(year), Number(day))),
                className: '',
                day: getDefaultPuzzleDay(day),
                year: Number(year),
                version: Number(foundVersion) || 1,
                part: Number(foundPart) || 1,
                last: false,
                path: '',
                extension: (foundExtension as Puzzle['extension']) || getConfig().PUZZLE_EXTENSION,
                useCustomInput: false,
            };

            newPuzzle.className = getClassName(newPuzzle);
            newPuzzle.path = `${path}/${newPuzzle.year}/${newPuzzle.day}/${newPuzzle.className}.${newPuzzle.extension}`;

            puzzles.push(newPuzzle);
        }
    });

    return puzzles;
}
