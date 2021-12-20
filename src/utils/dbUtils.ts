import {promises as fs} from "fs";
import {logger} from "./Logger";
import {Puzzle} from "../Puzzle";

type PuzzleFilter = Partial<Puzzle>

const puzzlesPath = "src/db/puzzles.json";

export const getPuzzles = async (filter: PuzzleFilter = {}) => {
    const puzzlesJson = await fs.readFile(puzzlesPath, {
        encoding: "utf8",
    }).catch((e) => {
        logger.error('An error occurs when retrieving the puzzles.json file')
        return Promise.reject(e)
    })

    try {
        const puzzles: Puzzle[] = JSON.parse(puzzlesJson)
        return puzzles.filter((puzzle) => {
            return Object.keys(filter).every((k) => puzzle[k as keyof Puzzle] === filter[k as keyof PuzzleFilter])
        })
    } catch (e) {
        logger.error('An error occurs when parsing the puzzles')
        return Promise.reject(e)
    }
}

export const getLastPuzzle = async () => {
    return (await getPuzzles({ last: true }))[0];
}

export const storePuzzles = async (puzzles: Puzzle[]) => {
    try {
        const puzzlesJson = JSON.stringify(puzzles);
        try {
            return fs.writeFile(puzzlesPath, puzzlesJson);
        } catch (e) {
            logger.error('An error occurs when writing the puzzles.json file')
            return Promise.reject(e)
        }
    } catch
        (e) {
        logger.error('An error occurs when parsing the puzzles')
        return Promise.reject(e)
    }
}


