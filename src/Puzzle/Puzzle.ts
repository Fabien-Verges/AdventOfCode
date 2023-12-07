export type Puzzle = {
    id: string;
    name: string;
    className: string;
    day: number;
    year: number;
    version: number;
    part: number;
    last: boolean;
    path: string;
    extension: Extension;
    useCustomInput: boolean;
};

export type PuzzleFromCli = {
    name: string;
    day: string;
    year: string;
    version: string;
    part: string;
    extension: Extension;
    useCustomInput: boolean;
};

export const EXTENSIONS = ['ts', 'js', 'py'] as const;
export type Extension = (typeof EXTENSIONS)[number];
