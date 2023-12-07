import fs from 'node:fs';
import os from 'node:os';
import promptly from 'promptly';

import {
    CONFIG_PATH,
    Config,
    DEFAULT_CONFIG,
    getConfig,
    storeAllPuzzles,
    stroreConfig,
} from '../../utils/ConfigFile.js';
import { logger } from '../../utils/Logger.js';
import { getPuzzlesFromFolder } from '../../utils/PuzzlesFolder.js';
import { EXTENSIONS } from '../../Puzzle/Puzzle.js';

export const setupHandler = async () => {
    logger.santa('Ho ho ho ! Welcome to the Advent Of Code CLI setup wizzard');
    const currentConf = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    if (Object.keys(currentConf).length !== 2 && currentConf.AOC_SESSION_TOKEN !== DEFAULT_CONFIG.AOC_SESSION_TOKEN) {
        logger.santa('It looks like you already have an Advent Of Code configuration');
        logger.santa("Let's review this configuration:");

        const oldConfig = getConfig();
        const newConfig = { ...oldConfig };
        for (const elem in (({ AOC_SESSION_TOKEN, PUZZLES_FOLDER_PATH, PUZZLE_EXTENSION, OPEN_ON_CREATE }) => ({
            AOC_SESSION_TOKEN,
            PUZZLES_FOLDER_PATH,
            PUZZLE_EXTENSION,
            OPEN_ON_CREATE,
        }))(oldConfig)) {
            const newElem = await promptly.prompt(`${elem}: (${oldConfig[elem]})`);
            if (newElem !== oldConfig[elem]) {
                newConfig[elem] = newElem;
            }
        }

        stroreConfig(newConfig);
        logger.success('Your new AOC config have been saved');
        if (oldConfig.PUZZLES_FOLDER_PATH !== newConfig.PUZZLES_FOLDER_PATH) {
            logger.info(
                `Your puzzle path have changed: ${oldConfig.PUZZLES_FOLDER_PATH} --> ${newConfig.PUZZLES_FOLDER_PATH}`
            );
            const foundPuzzles = await getPuzzlesFromFolder(newConfig.PUZZLES_FOLDER_PATH);
            if (foundPuzzles.length > 0) {
                logger.success(`${foundPuzzles.length} puzzles have been found!`);
                storeAllPuzzles(foundPuzzles);
            }
        }
    } else {
        logger.santa("Let's begin a first configuration for your future puzzles:");
        const newConfig = {};
        const configFields = [
            {
                type: 'prompt',
                name: 'AOC_SESSION_TOKEN',
                desc: 'Your Advent Of Code Session token (you can retrieve it from your browser inspector)',
                default: 'REPLACE_ME!',
            },
            {
                type: 'prompt',
                name: 'PUZZLES_FOLDER_PATH',
                desc: 'Your folder that will contains all your puzzles (I can create it for you)',
                default: `${os.homedir()}/Puzzles`,
            },
            {
                type: 'choice',
                choices: [...EXTENSIONS],
                name: 'PUZZLE_EXTENSION',
                desc: `The default extension for your puzzles (${EXTENSIONS})`,
                default: 'ts',
            },
            {
                type: 'choice',
                choices: ['true', 'false'],
                name: 'OPEN_ON_CREATE',
                desc: 'Tell me if you want me to open puzzles by default when you create them',
                default: 'true',
            },
        ];
        for await (const cf of configFields) {
            let value: string | boolean = '';

            switch (cf.type) {
                case 'choice':
                    value = await promptly.choose(`${cf.name} --> ${cf.desc}\n (default ${cf.default}):`, cf.choices!, {
                        default: cf.default,
                        trim: true,
                    });
                case 'prompt':
                    value = await promptly.prompt(`${cf.name} --> ${cf.desc}\n (default ${cf.default}):`, {
                        default: cf.default,
                        trim: true,
                    });
                    if (cf.name === 'PUZZLES_FOLDER_PATH') {
                        value = (value as string).startsWith('/')
                            ? value
                            : (value as string).startsWith('~')
                            ? (value as string).replace('~', os.homedir())
                            : `${process.cwd()}/${value}`;
                    }
            }

            newConfig[cf.name] = value === 'true' ? true : value === 'false' ? false : value;
        }

        stroreConfig(newConfig as Config);
        logger.success('Your new AOC config have been saved');
        const config = getConfig();
        if (fs.existsSync(config.PUZZLES_FOLDER_PATH)) {
            const foundPuzzles = await getPuzzlesFromFolder(config.PUZZLES_FOLDER_PATH);
            if (foundPuzzles.length > 0) {
                logger.success(`${foundPuzzles.length} puzzles have been found!`);
                storeAllPuzzles(foundPuzzles);
            }
        } else {
            fs.mkdirSync(config.PUZZLES_FOLDER_PATH, { recursive: true });
            logger.santa('You can create your first puzzle now!');
        }
    }
};
