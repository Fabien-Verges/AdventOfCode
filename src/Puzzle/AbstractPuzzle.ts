import { getInput } from "../utils";

export type PuzzleProperties = {
  name: string;
  year: number;
  day: number;
  position?: number;
  number?: number
  last?: boolean;
};

export class AbstractPuzzle {
  properties: PuzzleProperties;

  constructor(properties: PuzzleProperties) {
    if (this.constructor === AbstractPuzzle) {
      throw new TypeError(
        'Abstract class "Puzzle" cannot be instantiated directly'
      );
    }

    this.properties = properties;

    if (!this.properties.name) {
      throw new Error(`You must define a 'name' property`);
    }
  }

  async run(customInput?: any) {
    const input = await getInput(this.properties.year, this.properties.day);
    return this.resolve(customInput ? customInput : input);
  }

  resolve(input: any) {
    throw new Error(
      "You must implement a resolve() method to solve your puzzle :)"
    );
  }
}
