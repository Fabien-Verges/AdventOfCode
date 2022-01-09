import { promises as fs } from "fs";

export const camelize = (str: string) =>
    str
        .replace(/\b(\w)/g, (match, capture) => capture.toUpperCase())
        .replace(/\s+/g, "")
        .replace(/-+/g, "");

export const hasBeenIndexed = async (path: string, n: number | string) => {
  return fs
    .readFile(`${path}/index.ts`, {
      encoding: "utf8",
    })
    .then((b) => b.toString().includes(`export * from './${n}';`))
    .catch(() => false);
};

export const getDefaultPuzzleDay = (day: string | undefined): number => {
  if (day) {
    return Number(day);
  }
  const currentDay = new Date().getDate();
  return currentDay > 24 ? 24 : currentDay;
};
