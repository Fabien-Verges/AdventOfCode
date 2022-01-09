import {
    createPuzzle,
    getCreatePrompts,
    getPuzzles,
    interactiveLogger,
    logger,
} from "../../utils";

export const createHandler = async (options: any) => {
    logger.santa('Ho ho ho ! You are going to create a new Puzzle');

    const puzzles = await getPuzzles({ year: options.year, day: options.day });
    if (puzzles.length) {
        if(puzzles.length === 1) logger.warn('It seems that a puzzle already exists for this day.');

        logger.warn('It seems that some puzzles already exists for this day.');
        const choice = await getCreatePrompts(puzzles, options.name);

        if(choice.create) {
            options.number = puzzles.length + 1;
            await interactiveLogger.await('Creating the puzzle file...');
            await createPuzzle(options);
            logger.success('Your puzzle have been successfully created');
        }
    } else {
        await createPuzzle(options);
        logger.success('Your puzzle have been successfully created');
    }
}
