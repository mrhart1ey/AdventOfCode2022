import * as fs from "fs";

type RucksackGroup = string[];

const GROUP_SIZE = 3;
const LETTER_COUNT = 26;
const ASCII_LOWER_CASE_START = 97;
const ASCII_UPPER_CASE_START = 65;

const readInput = (): string[] => {
  const contents = fs.readFileSync("inputs/day3Input.txt").toString().trim();

  const allRucksackContents = contents.split("\n");

  return allRucksackContents;
};

const sum = (nums: number[]) => nums.reduce((total, num) => total + num);

const isLowerCase = (str: string) => str.toLowerCase() === str;

const calculateItemPriority = (item: string) =>
  isLowerCase(item)
    ? (item.codePointAt(0) as number) - ASCII_LOWER_CASE_START + 1
    : (item.codePointAt(0) as number) +
      LETTER_COUNT -
      ASCII_UPPER_CASE_START +
      1;

const findCommonItemInRucksackGroup = (
  rucksackGroup: RucksackGroup
): string => {
  const uniqueRucksackItems = rucksackGroup
    .slice(1, rucksackGroup.length)
    .map((rucksack) => new Set(rucksack));

  return rucksackGroup[0]
    .split("")
    .find((item) =>
      uniqueRucksackItems.every((rucksack) => rucksack.has(item))
    ) as string;
};

const findGroupItems = (rucksackGroups: RucksackGroup[]) =>
  rucksackGroups.map((rucksackGroup) =>
    findCommonItemInRucksackGroup(rucksackGroup)
  );

const splitIntoGroups = (
  allRucksacks: string[],
  groupSize: number
): RucksackGroup[] => {
  const groupCount = allRucksacks.length / groupSize;
  const groups: RucksackGroup[] = [];

  for (let i = 0; i < groupCount; i++) {
    groups.push(allRucksacks.slice(i * groupSize, i * groupSize + groupSize));
  }

  return groups;
};

export const answer = (): number => {
  const allRucksacks = readInput();

  const rucksacksInGroups = splitIntoGroups(allRucksacks, GROUP_SIZE);

  const groupItems = findGroupItems(rucksacksInGroups);

  const commonGroupItemsPriorities = groupItems.map((groupItem) =>
    calculateItemPriority(groupItem)
  );

  return sum(commonGroupItemsPriorities);
};
