import { logger } from "../../utils";

export const createHandler = (options: any) => {
    logger.santa('Ho ho ho ! You are going to create a new Puzzle');
    logger.info(`name: ${options.name}`);
    logger.info(`year: ${options.year}`);
    logger.info(`day: ${options.day}`);
}
