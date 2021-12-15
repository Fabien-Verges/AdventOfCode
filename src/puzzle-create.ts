import { Signale } from "signale";
import * as handlebars from "handlebars";

import { promises as fs } from "fs";
import { camelize, getDefaultPuzzleDay, hasBeenIndexed } from "./utils";

(async () => {
  const logger = new Signale({
    scope: "Puzzle creation",
    types: {
      santa: {
        badge: "🎅",
        color: "red",
        label: "santa",
        logLevel: "info",
      },
    },
  });
  // GET DAY, YEAR AND PUZZLE NAME FROM CLI
  const DAY = getDefaultPuzzleDay(process.env.DAY);
  const YEAR = Number(process.env.YEAR) || new Date().getFullYear();
  const NAME = process.env.NAME || "NoNamePuzzle";
  const PuzzleClassName = camelize(NAME);

  const PUZZLE_BASE_DIR_PATH = "./src/Puzzles";
  const PUZZLE_YEAR_DIR_PATH = `${PUZZLE_BASE_DIR_PATH}/${YEAR}`;
  const PUZZLE_DAY_DIR_PATH = `${PUZZLE_YEAR_DIR_PATH}/${DAY}`;
  const PUZZLE_FILE_PATH = `${PUZZLE_DAY_DIR_PATH}/${PuzzleClassName}.ts`;

  // START CREATION
  logger.await("Checking if the puzzle already exists...");
  try {
    await fs.access(PUZZLE_FILE_PATH);
    logger.santa("This puzzle already exists, Ho ho ho");
    logger.fatal("Aborting creation...");
    return;
  } catch (e) {
    logger.success("Okay it looks like we can create your puzzle");
    logger.pending("Creating the puzzle...");
    try {
      const puzzleTemplate = await fs.readFile("./src/Puzzle/puzzle.hbs", {
        encoding: "utf8",
      });
      try {
        await fs.mkdir(PUZZLE_DAY_DIR_PATH, { recursive: true });
        try {
          await fs.writeFile(
            PUZZLE_FILE_PATH,
            handlebars.compile(puzzleTemplate)({ PuzzleClassName })
          );

          try {
            logger.await("updating indexes...");
            if (!(await hasBeenIndexed(PUZZLE_DAY_DIR_PATH, PuzzleClassName))) {
              await fs.appendFile(
                `${PUZZLE_DAY_DIR_PATH}/index.ts`,
                `\nexport * from './${PuzzleClassName}';`
              );
            }

            if (!(await hasBeenIndexed(PUZZLE_YEAR_DIR_PATH, DAY))) {
              await fs.appendFile(
                `${PUZZLE_YEAR_DIR_PATH}/index.ts`,
                `\nexport * from './${DAY}';`
              );
            }

            if (!(await hasBeenIndexed(PUZZLE_BASE_DIR_PATH, YEAR))) {
              await fs.appendFile(
                `${PUZZLE_BASE_DIR_PATH}/index.ts`,
                `\nexport * from './${YEAR}';`
              );
            }
          } catch (e) {
            logger.error("An error occurs when updating index files...");
            logger.info(e);
            logger.fatal("Aborting creation...");
          }

          logger.success(
            `Your "${PuzzleClassName}" puzzle class have been successfully created`
          );
          logger.santa("Good luck !");
        } catch (e) {
          logger.error("An error occurs when creating your puzzle file...");
          logger.info(e);
          logger.fatal("Aborting creation...");
        }
      } catch (e) {
        logger.error("An error occurs when creating the folders...");
        logger.info(e);
        logger.fatal("Aborting creation...");
      }
    } catch (e) {
      logger.error("The Puzzle template was not found...");
      logger.fatal("Aborting creation...");
      return;
    }
  }
})();
