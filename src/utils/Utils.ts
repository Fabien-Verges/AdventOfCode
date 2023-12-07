import fs from 'node:fs';
import { exit } from 'process';

import { Puzzle } from '../Puzzle/Puzzle.js';
import { logger } from './Logger.js';

export const camelize = (str: string) =>
    str
        .replace(/\b(\w)/g, (match, capture) => capture.toUpperCase())
        .replace(/\s+/g, '')
        .replace(/-+/g, '')
        .replace(/[!?%$\*]/g, '');

export const getClassName = (puzzle: Puzzle) => {
    return `${camelize(puzzle.name)}${puzzle.version}Part${puzzle.part}`;
};

export const getDefaultPuzzleDay = (day: string): number => {
    day = day || new Date().getDate().toString();
    return Number(day) > 24 ? 24 : Number(day);
};

export function isEmpty(path: string) {
    return fs.readdirSync(path).length === 0;
}

export function throwError(...messages: string[]): never {
    messages.map((m) => logger.error(m));
    exit(1);
}
