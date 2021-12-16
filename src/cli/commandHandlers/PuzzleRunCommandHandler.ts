import { logger } from "../../utils";

export const runHandler = (options: any) => {
    logger.santa('Ho ho ho ! You are going to run a Puzzle');
    logger.info(`year: ${options.year}`);
    logger.info(`day: ${options.day}`);
}
