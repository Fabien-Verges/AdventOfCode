import fs from 'node:fs';
import os from 'node:os';

import type { Puzzle } from '../Puzzle/Puzzle.js';
import { throwError } from './Utils.js';

export const CONFIG_PATH = `${os.homedir()}/.aoc`;
export const DEFAULT_CONFIG = {
    AOC_HOSTNAME: 'https://adventofcode.com/',
    AOC_SESSION_TOKEN: 'AOC_SESSION_TOKEN',
};

export type Config = {
    AOC_HOSTNAME: string;
    AOC_SESSION_TOKEN: string;
    PUZZLES_FOLDER_PATH: string;
    PUZZLE_EXTENSION: Puzzle['extension'];
    OPEN_ON_CREATE: boolean;
    PUZZLES: Puzzle[];
};

export const getConfig = (): Config => {
    try {
        return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    } catch (error) {
        return DEFAULT_CONFIG as Config;
    }
};

export const stroreConfig = (newConfig: Partial<Config>) => {
    const config = getConfig();
    try {
        const configToStore = { ...config, ...newConfig };
        return fs.writeFileSync(CONFIG_PATH, JSON.stringify(configToStore, null, 4));
    } catch (e) {
        throwError('An error occurs when writing your AOC configuration');
    }
};

export const findPuzzles = async (filter: Partial<Puzzle> = {}) => {
    let config = getConfig();
    let puzzles = config.PUZZLES || [];

    return filter
        ? puzzles.filter((puzzle) => {
              return Object.keys(filter).every((k) => puzzle[k as keyof Puzzle] === filter[k as keyof Puzzle]);
          })
        : puzzles;
};

export const getLastPuzzle = async () => {
    return (await findPuzzles({ last: true }))[0];
};

export const storeAllPuzzles = async (puzzles: Puzzle[]) => {
    const config = getConfig();
    config.PUZZLES = puzzles;
    try {
        return fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    } catch (e) {
        throwError('An error has occurred when storing your puzzles into your AOC config');
    }
};

export const storePuzzle = async (puzzle: Puzzle) => {
    const config = getConfig();
    config.PUZZLES = [...(config.PUZZLES || []), puzzle];
    try {
        return fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    } catch (e) {
        throwError('An error has occurred when storing your puzzle into your AOC config');
    }
};
