import * as fs from "fs";

const START_OF_MESSAGE_LENGTH = 14;

const readInput = (): string => {
  const contents = fs.readFileSync("inputs/day6Input.txt").toString().trim();

  return contents;
};

const findStartOfMessageMarkerIndex = (signal: string): number => {
  for (let i = 0; i < signal.length - START_OF_MESSAGE_LENGTH; i++) {
    const uniqueChars = new Set<string>();

    for (let j = 0; j < START_OF_MESSAGE_LENGTH; j++) {
      uniqueChars.add(signal.charAt(i + j));
    }

    if (uniqueChars.size == START_OF_MESSAGE_LENGTH) {
      return i + START_OF_MESSAGE_LENGTH;
    }
  }

  throw new Error("Could not find the index");
};

export const answer = (): number => {
  const signal = readInput();

  const startOfMessageMarkerIndex = findStartOfMessageMarkerIndex(signal);

  return startOfMessageMarkerIndex;
};
